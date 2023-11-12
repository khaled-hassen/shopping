using Backend.GraphQL.UserResolver.Types;

namespace Backend.Interfaces;

public interface IUserService {
    Task<UserAuthResult> CreateUserAsync(string firstName, string lastName, string email, string phoneNumber, string password);

    Task<UserAuthResult?> LoginAsync(string email, string password);
}