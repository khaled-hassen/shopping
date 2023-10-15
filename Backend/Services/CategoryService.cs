﻿using Backend.Interfaces;
using Backend.Models;
using Backend.Types;
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

    public async Task<CreatedCategory> CreateCategoryAsync(string name) {
        var id = ObjectId.GenerateNewId();
        var category = new Category {
            Id = id,
            Name = name
        };

        await _collection.InsertOneAsync(category);
        return new CreatedCategory(id.ToString()!, name);
    }

    public async Task<bool> UpdateCategoryNameAsync(string id, string name) {
        var update = Builders<Category>.Update.Set(c => c.Name, name);
        var res = await _collection.UpdateOneAsync(c => c.Id.ToString() == id, update);
        return res is not null && res.ModifiedCount != 0;
    }

    public async Task<bool> DeleteCategoryAsync(string id) {
        var res = await _collection.DeleteOneAsync(c => c.Id.ToString() == id);
        if (res is null || res.DeletedCount == 0) return false;
        await _subcategoryCollection.DeleteManyAsync(c => c.CategoryId.ToString() == id);
        return true;
    }
}