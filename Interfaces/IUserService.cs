using Backend.GraphQL.UserResolver.Types;
using Backend.Types;
using MongoDB.Bson;

namespace Backend.Interfaces;

public interface IUserService {
    public Task CreateAccountAsync(string firstName, string lastName, string email, string phoneNumber, string password);

    public Task<UserAuthResult?> LoginAsync(string email, string password);

    public Task<AccessToken> RefreshAccessTokenAsync(ObjectId userId, string refreshToken);
    public Task LogoutAsync(ObjectId userId, string? refreshToken);
    public Task SendEmailVerificationEmailAsync(string email);
    public Task VerifyEmailAsync(string token);
    public Task SendPasswordResetEmailAsync(string email);
    public Task ResetPasswordAsync(string token, string newPassword);
    Task<PersonalDataEditResult> UpdatePersonalData(UserResult user, string firstName, string lastName, string phoneNumber, string email);
}