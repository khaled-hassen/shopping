using System.Globalization;
using System.Security.Claims;
using Backend.Exceptions;
using Backend.GraphQL.UserResolver.Types;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using Backend.Types;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class UserService : IUserService {
    private readonly IMailService _mailService;
    private readonly IMongoCollection<User> _users;

    public UserService(DatabaseService db, IMailService service) {
        _users = db.GetUsersCollection();
        _mailService = service;
    }

    public async Task CreateAccountAsync(string firstName, string lastName, string email, string phoneNumber, string password) {
        User? user = await _users.Find(c => c.Email == email.ToLower()).FirstOrDefaultAsync();
        if (user is not null) throw new UserExistException();

        var id = ObjectId.GenerateNewId();
        string? hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        await _users.InsertOneAsync(
            new User {
                Id = id,
                FirstName = firstName,
                LastName = lastName,
                Email = email.ToLower(),
                PhoneNumber = phoneNumber,
                Password = hashedPassword,
                RefreshTokens = new HashSet<RefreshToken>()
            }
        );

        string emailBody = _mailService.GenerateEmailVerificationEmail(id.ToString()!, email, firstName);
        await _mailService.SendMailAsync(email, firstName, "Email verification", emailBody);
    }

    public async Task<LoginResult?> LoginAsync(string email, string password) {
        User? user = await _users.Find(c => c.Email.Equals(email.ToLower())).FirstOrDefaultAsync();
        if (user is null) return null;
        if (!BCrypt.Net.BCrypt.Verify(password, user.Password)) return null;

        if (user.EmailVerifiedAt is null) {
            string emailBody = _mailService.GenerateEmailVerificationEmail(user.Id.ToString()!, email, user.FirstName);
            await _mailService.SendMailAsync(email, user.FirstName, "Email verification", emailBody);
            throw new GraphQLException(new Error("Email not verified", ErrorCodes.EmailNotVerified));
        }

        DateTime refreshTokenExpireDate = DateTime.Now.AddDays(30);
        var refreshToken = new RefreshToken {
            ExpireDate = refreshTokenExpireDate,
            Value = AuthHelpers.CreateToken(refreshTokenExpireDate)
        };
        await _users.UpdateOneAsync(c => c.Id.Equals(user.Id), Builders<User>.Update.AddToSet(c => c.RefreshTokens, refreshToken));

        var claims = new List<Claim> {
            new(ClaimTypes.Sid, user.Id.ToString()!)
        };
        DateTime accessTokenExpireDate = DateTime.Now.AddMinutes(15);
        string accessToken = AuthHelpers.CreateToken(accessTokenExpireDate, claims);

        var result = new AuthUserResult {
            Id = user.Id ?? ObjectId.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = email.ToLower(),
            PhoneNumber = user.PhoneNumber,
            EmailVerified = user.EmailVerifiedAt is not null,
            AccessToken = new AccessToken(accessToken, accessTokenExpireDate.AddMinutes(-2).ToString(CultureInfo.InvariantCulture)),
            BillingDetails = user.BillingDetails
        };
        return new LoginResult {
            Result = result,
            RefreshToken = refreshToken
        };
    }

    public async Task<AccessToken> RefreshAccessTokenAsync(ObjectId userId, string refreshToken) {
        ClaimsPrincipal? claimsPrincipal = AuthHelpers.ValidateToken(refreshToken);
        if (claimsPrincipal is null) throw new GraphQLException(new Error("Not authorized", ErrorCodes.UnauthorizedCode));
        User? user = await _users.Find(
                Builders<User>.Filter.And(
                    Builders<User>.Filter.Eq(c => c.Id, userId),
                    Builders<User>.Filter.ElemMatch(c => c.RefreshTokens, c => c.Value.Equals(refreshToken))
                )
            )
            .FirstOrDefaultAsync();
        if (user is null) throw new GraphQLException(new Error("Not authorized", ErrorCodes.UnauthorizedCode));
        RefreshToken? foundToken = user.RefreshTokens.Where(c => c.Value == refreshToken).FirstOrDefault();
        if (foundToken is null) throw new GraphQLException(new Error("Not authorized", ErrorCodes.UnauthorizedCode));

        if (foundToken.ExpireDate < DateTime.Now) {
            await _users.UpdateOneAsync(
                c => c.Id.Equals(userId),
                Builders<User>.Update.PullFilter(
                    c => c.RefreshTokens,
                    Builders<RefreshToken>.Filter.Eq(c => c.Value, refreshToken)
                )
            );
            throw new GraphQLException(new Error("Not authorized", ErrorCodes.UnauthorizedCode));
        }

        var claims = new List<Claim> {
            new(ClaimTypes.Sid, userId.ToString()!)
        };
        DateTime expireDate = DateTime.Now.AddMinutes(15);
        string token = AuthHelpers.CreateToken(expireDate, claims);

        return new AccessToken(token, expireDate.AddMinutes(-2).ToString(CultureInfo.InvariantCulture));
    }

    public async Task LogoutAsync(ObjectId userId, string? refreshToken) {
        if (refreshToken is null) return;
        await _users.UpdateOneAsync(
            c => c.Id.Equals(userId),
            Builders<User>.Update.PullFilter(
                c => c.RefreshTokens,
                Builders<RefreshToken>.Filter.Eq(c => c.Value, refreshToken)
            )
        );
    }

    public async Task SendEmailVerificationEmailAsync(string email) {
        User? user = await _users.Find(c => c.Email.Equals(email.ToLower())).FirstOrDefaultAsync();
        if (user is null) return;

        string emailBody = _mailService.GenerateEmailVerificationEmail(user.Id.ToString()!, email, user.FirstName);
        await _mailService.SendMailAsync(email, user.FirstName, "Email verification", emailBody);
    }

    public async Task VerifyEmailAsync(string token) {
        ClaimsPrincipal? claimsPrincipal = AuthHelpers.ValidateToken(token);
        if (claimsPrincipal is null) throw new UnauthorizedException();

        string? userId = claimsPrincipal.FindFirst(ClaimTypes.Sid)?.Value;
        string? email = claimsPrincipal.FindFirst(ClaimTypes.Email)?.Value;

        User? foundUser = await _users.Find(
            Builders<User>.Filter.And(
                Builders<User>.Filter.Eq(c => c.Id, ObjectId.Parse(userId)),
                Builders<User>.Filter.Eq(c => c.Email, email?.ToLower())
            )
        ).FirstOrDefaultAsync();
        if (foundUser is null) throw new UnauthorizedException();

        await _users.UpdateOneAsync(
            c => c.Id.ToString() == userId,
            Builders<User>.Update.Set(c => c.EmailVerifiedAt, DateTime.Now)
        );
    }

    public async Task SendPasswordResetEmailAsync(string email) {
        User? user = await _users.Find(c => c.Email.Equals(email.ToLower())).FirstOrDefaultAsync();
        if (user is null) return;

        string emailBody = _mailService.GeneratePasswordResetEmail(user.Id.ToString()!, email, user.FirstName);
        await _mailService.SendMailAsync(email, user.FirstName, "Reset password", emailBody);
    }

    public async Task ResetPasswordAsync(string token, string newPassword) {
        ClaimsPrincipal? claimsPrincipal = AuthHelpers.ValidateToken(token);
        if (claimsPrincipal is null) throw new UnauthorizedException();

        string? userId = claimsPrincipal.FindFirst(ClaimTypes.Sid)?.Value;
        string? email = claimsPrincipal.FindFirst(ClaimTypes.Email)?.Value;

        User? foundUser = await _users.Find(
            Builders<User>.Filter.And(
                Builders<User>.Filter.Eq(c => c.Id, ObjectId.Parse(userId)),
                Builders<User>.Filter.Eq(c => c.Email, email?.ToLower())
            )
        ).FirstOrDefaultAsync();
        if (foundUser is null) throw new UnauthorizedException();

        string? hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _users.UpdateOneAsync(
            c => c.Id.ToString() == userId,
            Builders<User>.Update.Set(c => c.Password, hashedPassword)
        );
    }

    public async Task<PersonalDataEditResult> UpdatePersonalDataAsync(
        UserResult authUser,
        string firstName,
        string lastName,
        string phoneNumber,
        string email
    ) {
        if (authUser.Email == email.ToLower() && authUser.FirstName == firstName && authUser.LastName == lastName)
            return new PersonalDataEditResult {
                Success = true,
                EmailChanged = false
            };

        UpdateDefinition<User>? update = Builders<User>.Update.Set(c => c.FirstName, firstName)
            .Set(c => c.LastName, lastName)
            .Set(c => c.PhoneNumber, phoneNumber);

        if (authUser.Email != email.ToLower()) {
            string emailBody = _mailService.GenerateEmailVerificationEmail(authUser.Id.ToString()!, email, firstName);
            await _mailService.SendMailAsync(email, firstName, "Email verification", emailBody);
            update = update.Set(c => c.Email, email.ToLower()).Set(c => c.EmailVerifiedAt, null);
        }

        await _users.UpdateOneAsync(c => c.Id.Equals(authUser.Id), update);
        return new PersonalDataEditResult {
            Success = true,
            EmailChanged = authUser.Email != email.ToLower()
        };
    }

    public async Task UpdateBillingDetailsAsync(UserResult user, BillingDetails details) =>
        await _users.UpdateOneAsync(
            c => c.Id.Equals(user.Id),
            Builders<User>.Update.Set(c => c.BillingDetails, details)
        );

    public async Task UpdatePasswordAsync(UserResult user, string oldPassword, string newPassword) {
        string? userPassword = await _users.Find(c => c.Id.Equals(user.Id))
            .Project(c => c.Password).FirstOrDefaultAsync();

        if (userPassword is null) throw new InvalidInputExceptions("Old password is incorrect");
        if (!BCrypt.Net.BCrypt.Verify(oldPassword, userPassword)) throw new InvalidInputExceptions("Old password is incorrect");
        await _users.UpdateOneAsync(
            c => c.Id.Equals(user.Id),
            Builders<User>.Update.Set(c => c.Password, BCrypt.Net.BCrypt.HashPassword(newPassword))
        );
    }
}