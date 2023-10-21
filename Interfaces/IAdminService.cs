using Backend.Models;

namespace Backend.Interfaces;

public interface IAdminService {
    public Task<Admin?> GetAdmin(string email, string password);
}