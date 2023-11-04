using Backend.Models;

namespace Backend.Interfaces;

public interface IAdminService {
    public Task<Admin?> GetAdminAsync(string email, string password);
}