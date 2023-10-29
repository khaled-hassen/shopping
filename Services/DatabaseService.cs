using Backend.Models;
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

    private IMongoCollection<T> GetCollection<T>(string name) {
        return _database.GetCollection<T>(name);
    }

    public IMongoCollection<Category> GetCategoryCollection() {
        return GetCollection<Category>("categories");
    }

    public IMongoCollection<Subcategory> GetSubcategoryCollection() {
        return GetCollection<Subcategory>("subcategories");
    }

    public IMongoCollection<Admin> GetAdminCollection() {
        return GetCollection<Admin>("admins");
    }

    public IMongoCollection<Config> GetConfigCollection() {
        return GetCollection<Config>("config");
    }
}