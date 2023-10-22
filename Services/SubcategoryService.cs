using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using MongoDB.Bson;
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

    public async Task<List<Subcategory>?> GetSubcategoriesAsync(string categoryId) {
        var cat = _categoryCollection.Find(c => c.Id.ToString() == categoryId).FirstOrDefault();
        if (cat is null) return null;
        return await _collection.Find(c => c.CategoryId.ToString() == categoryId).ToListAsync();
    }

    public async Task<Subcategory?> CreateSubcategoryAsync(string categoryId, Subcategory subcategory, IFile image) {
        var parentId = ObjectId.Parse(categoryId);
        subcategory.CategoryId = parentId;
        var id = ObjectId.GenerateNewId();
        subcategory.Id = id;

        var path = await FileUploadHelper.UploadFile(image, categoryId, id.ToString()!);
        subcategory.Image = path;

        subcategory.Name = subcategory.Name.Trim();
        if (subcategory.ProductTypes is not null) {
            HashSet<string> lowercaseTypes = new();
            foreach (var type in subcategory.ProductTypes)
                lowercaseTypes.Add(type.ToLower().Trim());
            subcategory.ProductTypes = lowercaseTypes;
        }

        if (subcategory.Filters is not null) {
            HashSet<Filter> lowercaseFilters = new();
            foreach (var filter in subcategory.Filters)
                lowercaseFilters.Add(
                    filter with {
                        Name = filter.Name.ToLower().Trim(),
                        Unit = filter.Unit.ToLower().Trim()
                    }
                );
            subcategory.Filters = lowercaseFilters;
        }

        var updated = await _categoryCollection.UpdateOneAsync(
            c => c.Id.Equals(parentId),
            Builders<Category>.Update.Push(c => c.SubcategoriesIds, id)
        );

        if (updated is null || updated.ModifiedCount == 0) return null;

        await _collection.InsertOneAsync(subcategory);
        return subcategory;
    }

    public async Task<bool> UpdateSubcategoryAsync(string id, string name, IFile? image) {
        var subcategory = await _collection.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
        if (subcategory is null) return false;

        var update = Builders<Subcategory>.Update.Set(c => c.Name, name.Trim());
        if (image is not null) {
            FileUploadHelper.DeleteFile(subcategory.Image ?? "");
            var path = await FileUploadHelper.UploadFile(image, subcategory.CategoryId.ToString()!, id);
            update = update.Set(c => c.Image, path);
        }

        var updated = await _collection.UpdateOneAsync(
            c => c.Id.ToString() == id,
            update
        );
        return updated is not null && updated.ModifiedCount > 0;
    }

    public async Task<bool> UpdateSubcategoryProductTypesAsync(string id, HashSet<string> productTypes) {
        HashSet<string> lowercaseTypes = new();
        foreach (var type in productTypes)
            lowercaseTypes.Add(type.ToLower().Trim());

        var updated = await _collection.UpdateOneAsync(
            c => c.Id.ToString() == id,
            Builders<Subcategory>.Update.Set(c => c.ProductTypes, lowercaseTypes)
        );
        return updated is not null && updated.ModifiedCount > 0;
    }

    public async Task<bool> UpdateSubcategoryFiltersAsync(string id, HashSet<Filter> filters) {
        HashSet<Filter> lowercaseFilters = new();
        foreach (var filter in filters)
            lowercaseFilters.Add(
                filter with {
                    Name = filter.Name.ToLower().Trim(),
                    Unit = filter.Unit.ToLower().Trim()
                }
            );

        var updated = await _collection.UpdateOneAsync(
            c => c.Id.ToString() == id,
            Builders<Subcategory>.Update.Set(c => c.Filters, lowercaseFilters)
        );
        return updated is not null && updated.ModifiedCount > 0;
    }

    public async Task<bool> DeleteSubcategoryAsync(string id) {
        var subcategory = await _collection.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
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

        FileUploadHelper.DeleteFile(subcategory.Image ?? "");
        return deleted is not null && deleted.DeletedCount > 0;
    }
}