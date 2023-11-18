using Backend.GraphQL.UserResolver.Types;
using Backend.Models;

namespace Backend.Interfaces;

public interface IStoreService {
    Task<Store?> GetStoreAsync(UserResult user);
    Task<Store> CreateStoreAsync(UserResult user, string name, string description, IFile image);
}