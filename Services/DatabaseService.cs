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
        Type documentType = typeof(T);
        IEnumerable<string> uniqueFields = documentType.GetProperties()
            .Where(p => p.GetCustomAttribute<UniqueFieldAttribute>() is not null)
            .Select(p => p.Name);

        IMongoCollection<T>? collection = _database.GetCollection<T>(name);
        foreach (string fieldName in uniqueFields) {
            IndexKeysDefinition<T>? keys = Builders<T>.IndexKeys.Ascending(fieldName);
            var indexOptions = new CreateIndexOptions { Unique = true };
            var model = new CreateIndexModel<T>(keys, indexOptions);
            collection.Indexes.CreateOne(model);
        }

        return collection;
    }

    public IMongoCollection<Category> GetCategoriesCollection() => GetCollection<Category>("categories");

    public IMongoCollection<Subcategory> GetSubcategoriesCollection() => GetCollection<Subcategory>("subcategories");

    public IMongoCollection<Admin> GetAdminsCollection() => GetCollection<Admin>("admins");

    public IMongoCollection<Config> GetConfigCollection() => GetCollection<Config>("config");

    public IMongoCollection<User> GetUsersCollection() => GetCollection<User>("users");

    public IMongoCollection<Store> GetStoresCollection() => GetCollection<Store>("stores");
}