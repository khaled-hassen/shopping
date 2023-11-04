using Backend.GraphQL.CategoryResolver.Types;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class CategoryService : ICategoryService {
    private readonly IMongoCollection<Category> _collection;
    private readonly IMongoCollection<Subcategory> _subcategoryCollection;

    public CategoryService(DatabaseService database) {
        _collection = database.GetCategoryCollection();
        _subcategoryCollection = database.GetSubcategoryCollection();
    }

    public async Task<List<CategoryResult>> GetCategoriesAsync() {
        return await _collection.Aggregate()
            .Lookup<Category, Subcategory, CategoryResult>(
                _subcategoryCollection,
                category => category.SubcategoriesIds,
                subcategory => subcategory.Id,
                categoryResult => categoryResult.Subcategories
            )
            .ToListAsync();
    }

    public async Task<List<CategoryResult>> GetTopCategoriesAsync() {
        return await _collection.Aggregate()
            .Lookup<Category, Subcategory, CategoryResult>(
                _subcategoryCollection,
                category => category.SubcategoriesIds,
                subcategory => subcategory.Id,
                categoryResult => categoryResult.Subcategories
            )
            .Limit(4)
            .ToListAsync();
    }

    public async Task<CategoryResult?> GetCategoryAsync(string id) {
        return await _collection
            .Aggregate()
            .Match(c => c.Id.ToString() == id)
            .Lookup<Category, Subcategory, CategoryResult>(
                _subcategoryCollection,
                category => category.SubcategoriesIds,
                subcategory => subcategory.Id,
                categoryResult => categoryResult.Subcategories
            )
            .FirstOrDefaultAsync();
    }

    public async Task<CreatedCategory> CreateCategoryAsync(string name, IFile image) {
        var id = ObjectId.GenerateNewId();
        var path = await FileUploadHelper.UploadFile(image, id.ToString()!, id.ToString()!);

        var category = new Category {
            Id = id,
            Name = name.Trim(),
            Image = path
        };

        await _collection.InsertOneAsync(category);
        return new CreatedCategory(id.ToString()!, name, path);
    }

    public async Task<bool> UpdateCategoryAsync(string id, string name, IFile? image) {
        var category = await _collection.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
        if (category is null) return false;

        var update = Builders<Category>.Update.Set(c => c.Name, name.Trim());
        if (image is not null) {
            FileUploadHelper.DeleteFile(category.Image);
            var path = await FileUploadHelper.UploadFile(image, id, id);
            update = update.Set(c => c.Image, path);
        }

        var res = await _collection.UpdateOneAsync(c => c.Id.ToString() == id, update);
        return res is not null && res.ModifiedCount != 0;
    }

    public async Task<bool> DeleteCategoryAsync(string id) {
        var res = await _collection.DeleteOneAsync(c => c.Id.ToString() == id);
        if (res is null || res.DeletedCount == 0) return false;
        await _subcategoryCollection.DeleteManyAsync(c => c.CategoryId.ToString() == id);
        FileUploadHelper.DeleteDirectory(id);
        return true;
    }
}