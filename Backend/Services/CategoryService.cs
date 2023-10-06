using Backend.Interfaces;
using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services;

public class CategoryService : ICategoryService {
    private readonly IMongoCollection<Category> _collection;

    public CategoryService(DatabaseService database) {
        _collection = database.GetCollection<Category>("categories");
    }

    public async Task<IEnumerable<Category>> GetCategoriesAsync() {
        return await _collection.Find(c => true).ToListAsync();
    }

    public async Task<Category?> GetCategoryAsync(string id) {
        return await _collection.Find(c => c.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Category> CreateCategoryAsync(string name) {
        var category = new Category {
            Name = name
        };
        await _collection.InsertOneAsync(category);
        return category;
    }

    public async Task<bool> UpdateCategoryNameAsync(string id, string name) {
        var update = Builders<Category>.Update.Set(c => c.Name, name);
        var res = await _collection.UpdateOneAsync(c => c.Id == id, update);
        return res is not null && res.ModifiedCount != 0;
    }

    public async Task<bool> DeleteCategoryAsync(string id) {
        var res = await _collection.DeleteOneAsync(c => c.Id == id);
        return res is not null && res.DeletedCount != 0;
    }
}