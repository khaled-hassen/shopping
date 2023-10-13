using Backend.Interfaces;
using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services;

public class SubcategoryService : ISubcategoryService {
    private readonly IMongoCollection<Category> _categoryCollection;
    private readonly IMongoCollection<Subcategory> _collection;

    public SubcategoryService(DatabaseService database) {
        _collection = database.GetSubcategoryCollection();
        _categoryCollection = database.GetCategoryCollection();
    }

    public async Task<Subcategory?> GetSubcategoryAsync(string id) {
        return await _collection.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
    }

    public async Task<List<Subcategory>> GetSubcategoriesAsync(string categoryId) {
        return await _collection.Find(c => c.CategoryId.ToString() == categoryId).ToListAsync();
    }

    public async Task<Subcategory?> CreateCategoryAsync(string categoryId, Subcategory subcategory) {
        // var parentId = ObjectId.Parse(categoryId);
        // subcategory.CategoryId = parentId;
        // var id = ObjectId.GenerateNewId();
        // subcategory.Id = id;
        //
        // var updated = await _categoryCollection.UpdateOneAsync(
        //     c => c.Id.Equals(parentId),
        //     Builders<Category>.Update.Push(c => c.SubcategoriesIds, id)
        // );
        //
        // if (updated is null || updated.ModifiedCount == 0) return null;
        //
        // await _collection.InsertOneAsync(subcategory);
        // return subcategory;
        throw new NotImplementedException();
    }

    public Task<bool> UpdateSubcategoryAsync(string id, Subcategory subcategory) {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteSubcategoryAsync(string id) {
        var subcategory = _collection.Find(c => c.Id.ToString() == id).FirstOrDefault();
        if (subcategory is null) return false;
        var categoryId = subcategory.CategoryId;
        var category = await _categoryCollection.Find(c => c.Id.Equals(categoryId)).FirstOrDefaultAsync();
        if (category is null) return false;

        var updated = await _categoryCollection.UpdateOneAsync(
            c => c.Id.Equals(categoryId),
            Builders<Category>.Update.Pull(c => c.SubcategoriesIds, subcategory.Id!.Value)
        );
        if (updated is null || updated.ModifiedCount == 0) return false;

        var deleted = await _collection.DeleteOneAsync(c => c.Id.ToString() == id);
        return deleted is not null && deleted.DeletedCount > 0;
    }
}