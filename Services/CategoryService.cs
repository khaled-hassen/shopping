using Backend.GraphQL.CategoryResolver.Types;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class CategoryService : ICategoryService {
    private readonly IMongoCollection<Category> _categories;
    private readonly IFileUploadService _fileUploadService;
    private readonly IMongoCollection<Subcategory> _subcategories;

    public CategoryService(DatabaseService database, IFileUploadService fileUploadService) {
        _fileUploadService = fileUploadService;
        _categories = database.GetCategoriesCollection();
        _subcategories = database.GetSubcategoriesCollection();
    }

    public async Task<List<CategoryResult>> GetCategoriesAsync() =>
        await _categories.Aggregate()
            .Lookup<Category, Subcategory, CategoryResult>(
                _subcategories,
                category => category.SubcategoriesIds,
                subcategory => subcategory.Id,
                categoryResult => categoryResult.Subcategories
            )
            .ToListAsync();

    public async Task<List<CategoryResult>> GetTopCategoriesAsync() =>
        await _categories.Aggregate()
            .Lookup<Category, Subcategory, CategoryResult>(
                _subcategories,
                category => category.SubcategoriesIds,
                subcategory => subcategory.Id,
                categoryResult => categoryResult.Subcategories
            )
            .Limit(4)
            .ToListAsync();

    public async Task<CategoryResult?> GetCategoryAsync(string id) =>
        await _categories
            .Aggregate()
            .Match(c => c.Slug == id || c.Id.ToString() == id)
            .Lookup<Category, Subcategory, CategoryResult>(
                _subcategories,
                category => category.SubcategoriesIds,
                subcategory => subcategory.Id,
                categoryResult => categoryResult.Subcategories
            )
            .FirstOrDefaultAsync();

    public async Task<CreatedCategory> CreateCategoryAsync(string name, IFile image) {
        var id = ObjectId.GenerateNewId();
        string path = await _fileUploadService.UploadFileAsync(image, id.ToString()!, id.ToString()!);

        var category = new Category {
            Id = id,
            Name = name.Trim(),
            Image = path,
            Slug = StringUtils.CreateSlug(name.Trim())
        };

        await _categories.InsertOneAsync(category);
        return new CreatedCategory(id.ToString()!, name, path);
    }

    public async Task<bool> UpdateCategoryAsync(string id, string name, IFile? image) {
        Category? category = await _categories.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
        if (category is null) return false;

        UpdateDefinition<Category>? update = Builders<Category>.Update
            .Set(c => c.Name, name.Trim())
            .Set(c => c.Slug, StringUtils.CreateSlug(name.Trim()));
        if (image is not null) {
            _fileUploadService.DeleteFile(category.Image);
            string path = await _fileUploadService.UploadFileAsync(image, id, id);
            update = update.Set(c => c.Image, path);
        }

        UpdateResult? res = await _categories.UpdateOneAsync(c => c.Id.ToString() == id, update);
        return res is not null && res.ModifiedCount != 0;
    }

    public async Task<bool> DeleteCategoryAsync(string id) {
        DeleteResult? res = await _categories.DeleteOneAsync(c => c.Id.ToString() == id);
        if (res is null || res.DeletedCount == 0) return false;
        await _subcategories.DeleteManyAsync(c => c.CategoryId.ToString() == id);
        _fileUploadService.DeleteDirectory(id);
        return true;
    }
}