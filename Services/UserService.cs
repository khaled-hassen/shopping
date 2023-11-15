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
        var user = await _users.Find(c => c.Email == email.ToLower()).FirstOrDefaultAsync();
        if (user is not null) throw new UserExistException();

        var id = ObjectId.GenerateNewId();
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
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

        var emailBody = _mailService.GenerateEmailVerification(id.ToString()!, email, firstName);
        await _mailService.SendMailAsync(email, firstName, "Email verification", emailBody);
    }

    public async Task<UserAuthResult?> LoginAsync(string email, string password) {
        var user = await _users.Find(c => c.Email.Equals(email.ToLower())).FirstOrDefaultAsync();
        if (user is null) return null;
        if (!BCrypt.Net.BCrypt.Verify(password, user.Password)) return null;

        if (user.EmailVerifiedAt is null) {
            var emailBody = _mailService.GenerateEmailVerification(user.Id.ToString()!, email, user.FirstName);
            await _mailService.SendMailAsync(email, user.FirstName, "Email verification", emailBody);
            throw new GraphQLException(new Error("Email not verified", ErrorCodes.EmailNotVerified));
        }

        var refreshTokenExpireDate = DateTime.Now.AddDays(30);
        var refreshToken = new RefreshToken {
            ExpireDate = refreshTokenExpireDate,
            Value = AuthHelpers.CreateToken(refreshTokenExpireDate)
        };
        await _users.UpdateOneAsync(c => c.Id.Equals(user.Id), Builders<User>.Update.AddToSet(c => c.RefreshTokens, refreshToken));

        var claims = new List<Claim> {
            new(ClaimTypes.Sid, user.Id.ToString()!)
        };
        var accessTokenExpireDate = DateTime.Now.AddMinutes(15);
        var accessToken = AuthHelpers.CreateToken(accessTokenExpireDate, claims);

        var result = new UserResult {
            Id = user.Id ?? ObjectId.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = email.ToLower(),
            PhoneNumber = user.PhoneNumber,
            AccessToken = new AccessToken(accessToken, accessTokenExpireDate.AddMinutes(-2).ToString(CultureInfo.InvariantCulture))
        };
        return new UserAuthResult {
            Result = result,
            RefreshToken = refreshToken
        };
    }

    public async Task<AccessToken> RefreshAccessTokenAsync(ObjectId userId, string refreshToken) {
        var claimsPrincipal = AuthHelpers.ValidateToken(refreshToken);
        if (claimsPrincipal is null) throw new GraphQLException(new Error("Not authorized", ErrorCodes.UnauthorizedCode));
        var foundToken = await _users.Find(
                Builders<User>.Filter.And(
                    Builders<User>.Filter.Eq(c => c.Id, userId),
                    Builders<User>.Filter.ElemMatch(c => c.RefreshTokens, c => c.Value.Equals(refreshToken))
                )
            ).Project<RefreshToken>(
                Builders<User>.Projection
                    .Include(c => c.RefreshTokens)
            )
            .FirstOrDefaultAsync();
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
        var expireDate = DateTime.Now.AddMinutes(15);
        var token = AuthHelpers.CreateToken(expireDate, claims);

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

    public async Task SendEmailVerificationAsync(string email) {
        var user = await _users.Find(c => c.Email.Equals(email.ToLower())).FirstOrDefaultAsync();
        if (user is null) return;

        var emailBody = _mailService.GenerateEmailVerification(user.Id.ToString()!, email, user.FirstName);
        await _mailService.SendMailAsync(email, user.FirstName, "Email verification", emailBody);
    }

    public async Task VerifyEmailAsync(string token) {
        var claimsPrincipal = AuthHelpers.ValidateToken(token);
        if (claimsPrincipal is null) throw new UnauthorizedException();

        var userId = claimsPrincipal.FindFirst(ClaimTypes.Sid)?.Value;
        var email = claimsPrincipal.FindFirst(ClaimTypes.Email)?.Value;

        var foundUser = await _users.Find(
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
}