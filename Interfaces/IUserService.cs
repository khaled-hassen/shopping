using Backend.GraphQL.UserResolver.Types;
using Backend.Models;
using Backend.Types;
using MongoDB.Bson;

namespace Backend.Interfaces;

public interface IUserService {
    public Task CreateAccountAsync(string firstName, string lastName, string email, string phoneNumber, string password);

    public Task<LoginResult?> LoginAsync(string email, string password);

    public Task<AccessToken> RefreshAccessTokenAsync(string refreshToken);
    public Task LogoutAsync(ObjectId userId, string? refreshToken);
    public Task SendEmailVerificationEmailAsync(string email);
    public Task VerifyEmailAsync(string token);
    public Task SendPasswordResetEmailAsync(string email);
    public Task ResetPasswordAsync(string token, string newPassword);
    Task<PersonalDataEditResult> UpdatePersonalDataAsync(UserResult authUser, string firstName, string lastName, string phoneNumber, string email);
    Task UpdateBillingDetailsAsync(UserResult user, BillingDetails details);
    Task UpdatePasswordAsync(UserResult user, string oldPassword, string newPassword);
}