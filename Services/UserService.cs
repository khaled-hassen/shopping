using System.Globalization;
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
    private readonly IMongoCollection<User> _users;

    public UserService(DatabaseService db) {
        _users = db.GetUsersCollection();
    }

    public async Task<UserAuthResult> CreateUserAsync(
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        string password
    ) {
        var user = await _users.Find(c => c.Email == email.ToLower()).FirstOrDefaultAsync();
        if (user is not null) throw new UserExistException();

        var id = ObjectId.GenerateNewId();
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var refreshTokenExpireDate = DateTime.Now.AddDays(30);
        var refreshToken = new RefreshToken {
            ExpireDate = refreshTokenExpireDate,
            Value = AuthHelpers.CreateToken(refreshTokenExpireDate)
        };
        await _users.InsertOneAsync(
            new User {
                Id = id,
                FirstName = firstName,
                LastName = lastName,
                Email = email.ToLower(),
                PhoneNumber = phoneNumber,
                Password = hashedPassword,
                RefreshTokens = new HashSet<RefreshToken> {
                    refreshToken
                }
            }
        );

        var accessTokenExpireDate = DateTime.Now.AddMinutes(15);
        var accessToken = AuthHelpers.CreateToken(accessTokenExpireDate);

        var result = new UserResult {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            Email = email.ToLower(),
            PhoneNumber = phoneNumber,
            AccessToken = new AccessToken(accessToken, accessTokenExpireDate.ToString(CultureInfo.InvariantCulture))
        };
        return new UserAuthResult {
            Result = result,
            RefreshToken = refreshToken
        };
    }
}