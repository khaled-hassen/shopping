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

    public async Task<Store?> GetStoreAsync(UserResult user) => await _stores.Find(c => c.Owner.Equals(user.Id)).FirstOrDefaultAsync();

    public async Task<Store> CreateStoreAsync(UserResult user, string name, string description, IFile image) {
        var id = ObjectId.GenerateNewId();
        string imagePath = await _fileUploadService.UploadFileAsync(image, "stores", id.ToString()!);

        var store = new Store {
            Id = ObjectId.GenerateNewId(),
            Owner = user.Id,
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

    public async Task UpdateStoreAsync(UserResult user, string name, string description, IFile image) {
        Store? store = await _stores.Find(c => c.Owner.Equals(user.Id)).FirstOrDefaultAsync();
        if (store is null) return;

        _fileUploadService.DeleteFile(store.Image);
        string imagePath = await _fileUploadService.UploadFileAsync(image, "stores", store.Id.ToString()!);
        await _stores.UpdateOneAsync(
            c => c.Id.Equals(store.Id),
            Builders<Store>.Update.Set(c => c.Name, name)
                .Set(c => c.Description, description)
                .Set(c => c.Image, imagePath)
        );
    }
}