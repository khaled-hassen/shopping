using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services;

public class AdminHostedService : IHostedService {
    private readonly IMongoCollection<Admin> _collection;
    private readonly IConfiguration _configuration;

    public AdminHostedService(IConfiguration configuration, DatabaseService database) {
        _configuration = configuration;
        _collection = database.GetAdminCollection();
    }

    public async Task StartAsync(CancellationToken cancellationToken) {
        var email = _configuration.GetSection("AdminCredentials:Email").Value ?? string.Empty;
        var password = _configuration.GetSection("AdminCredentials:password").Value ?? string.Empty;

        if (email.Equals(string.Empty) || password.Equals(string.Empty))
            throw new Exception("Admin credentials are not set in appsettings.json (AdminCredentials:Email, AdminCredentials:Password).");

        var admin = _collection.Find(a => true).FirstOrDefault();
        if (admin is not null) return;

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        await _collection.InsertOneAsync(
            new Admin {
                Email = email,
                Password = passwordHash
            },
            null,
            cancellationToken
        );
    }

    public Task StopAsync(CancellationToken cancellationToken) {
        return Task.CompletedTask;
    }
}