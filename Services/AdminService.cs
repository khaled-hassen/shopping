using Backend.Interfaces;
using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services;

public class AdminService : IAdminService {
    private readonly IMongoCollection<Admin> _collection;

    public AdminService(DatabaseService database) {
        _collection = database.GetAdminsCollection();
    }

    public async Task<Admin?> GetAdminAsync(string email, string password) {
        var admin = await _collection.Find(c => c.Email.Equals(email)).FirstOrDefaultAsync();
        if (admin is null) return null;
        if (!BCrypt.Net.BCrypt.Verify(password, admin.Password)) return null;
        return admin;
    }
}