using Backend.GraphQL.UserResolver.Types;
using Backend.Types;
using MongoDB.Bson;

namespace Backend.Interfaces;

public interface IUserService {
    Task CreateUserAsync(string firstName, string lastName, string email, string phoneNumber, string password);

    Task<UserAuthResult?> LoginAsync(string email, string password);

    Task<AccessToken> RefreshAccessTokenAsync(ObjectId userId, string refreshToken);
    Task LogoutAsync(ObjectId userId, string? refreshToken);
    Task SendEmailVerificationAsync(string email);
}