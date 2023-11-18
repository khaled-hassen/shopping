using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class StoreService : IStoreService {
    private readonly IFileUploadService _fileUploadService;
    private readonly IMongoCollection<Store> _stores;

    public StoreService(DatabaseService db, IFileUploadService fileUploadService) {
        _fileUploadService = fileUploadService;
        _stores = db.GetStoresCollection();
    }

    public async Task<Store?> GetStoreAsync(UserResult user) => await _stores.Find(c => c.Id.Equals(user.Id)).FirstOrDefaultAsync();

    public async Task<Store> CreateStoreAsync(UserResult user, string name, string description, IFile image) {
        var id = ObjectId.GenerateNewId();
        string imagePath = await _fileUploadService.UploadFile(image, "stores", id.ToString()!);

        var store = new Store {
            Id = ObjectId.GenerateNewId(),
            Owner = id,
            Name = name,
            Description = description,
            Image = imagePath,
            Balance = new StoreBalance {
                Balance = 0,
                TotalSales = 0
            }
        };

        await _stores.InsertOneAsync(store);
        return store;
    }
}