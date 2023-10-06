using Backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Services;

public class DatabaseService {
    private readonly IMongoDatabase _database;

    public DatabaseService(IOptions<DataBaseSettings> settings) {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<T> GetCollection<T>(string name) {
        return _database.GetCollection<T>(name);
    }
}