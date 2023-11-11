using System.Reflection;
using Backend.Attributes;
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
        var documentType = typeof(T);
        var uniqueFields = documentType.GetProperties()
            .Where(p => p.GetCustomAttribute<UniqueFieldAttribute>() is not null)
            .Select(p => p.Name);

        var collection = _database.GetCollection<T>(name);
        foreach (var fieldName in uniqueFields) {
            var keys = Builders<T>.IndexKeys.Ascending(fieldName);
            var indexOptions = new CreateIndexOptions { Unique = true };
            var model = new CreateIndexModel<T>(keys, indexOptions);
            collection.Indexes.CreateOne(model);
        }

        return collection;
    }

    public IMongoCollection<Category> GetCategoriesCollection() {
        return GetCollection<Category>("categories");
    }

    public IMongoCollection<Subcategory> GetSubcategoriesCollection() {
        return GetCollection<Subcategory>("subcategories");
    }

    public IMongoCollection<Admin> GetAdminsCollection() {
        return GetCollection<Admin>("admins");
    }

    public IMongoCollection<Config> GetConfigCollection() {
        return GetCollection<Config>("config");
    }

    public IMongoCollection<User> GetUsersCollection() {
        return GetCollection<User>("users");
    }
}