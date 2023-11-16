using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class SubcategoryService : ISubcategoryService {
    private readonly IMongoCollection<Category> _categories;
    private readonly IFileUploadService _fileUploadService;
    private readonly IMongoCollection<Subcategory> _subcategories;

    public SubcategoryService(DatabaseService database, IFileUploadService fileUploadService) {
        _fileUploadService = fileUploadService;
        _subcategories = database.GetSubcategoriesCollection();
        _categories = database.GetCategoriesCollection();
    }

    public async Task<Subcategory?> GetSubcategoryAsync(string id) {
        return await _subcategories.Find(c => c.Slug == id || c.Id.ToString() == id).FirstOrDefaultAsync();
    }

    public async Task<List<Subcategory>?> GetSubcategoriesAsync(string categoryId) {
        var cat = _categories.Find(c => c.Id.ToString() == categoryId).FirstOrDefault();
        if (cat is null) return null;
        return await _subcategories.Find(c => c.CategoryId.ToString() == categoryId).ToListAsync();
    }

    public async Task<Subcategory?> CreateSubcategoryAsync(string categoryId, Subcategory subcategory, IFile image) {
        var parentId = ObjectId.Parse(categoryId);
        subcategory.CategoryId = parentId;
        var id = ObjectId.GenerateNewId();
        subcategory.Id = id;

        var path = await _fileUploadService.UploadFile(image, categoryId, id.ToString()!);
        subcategory.Image = path;
        subcategory.Name = subcategory.Name.Trim();
        subcategory.ProductTypes = StringUtils.ToLowerCase(subcategory.ProductTypes);
        subcategory.Slug = StringUtils.CreateSlug(subcategory.Name);

        HashSet<Filter> lowercaseFilters = new();
        foreach (var filter in subcategory.Filters) {
            var products = StringUtils.ToLowerCase(filter.ProductTypes);
            products.IntersectWith(subcategory.ProductTypes);
            lowercaseFilters.Add(
                filter with {
                    Name = filter.Name.ToLower().Trim(),
                    Unit = filter.Unit.ToLower().Trim(),
                    ProductTypes = products
                }
            );
        }

        subcategory.Filters = lowercaseFilters;

        var updated = await _categories.UpdateOneAsync(
            c => c.Id.Equals(parentId),
            Builders<Category>.Update.Push(c => c.SubcategoriesIds, id)
        );

        if (updated is null || updated.ModifiedCount == 0) return null;

        await _subcategories.InsertOneAsync(subcategory);
        return subcategory;
    }

    public async Task<bool> UpdateSubcategoryAsync(string id, string name, IFile? image) {
        var subcategory = await _subcategories.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
        if (subcategory is null) return false;

        var update = Builders<Subcategory>.Update
            .Set(c => c.Name, name.Trim())
            .Set(c => c.Slug, StringUtils.CreateSlug(name.Trim()));
        if (image is not null) {
            _fileUploadService.DeleteFile(subcategory.Image ?? "");
            var path = await _fileUploadService.UploadFile(image, subcategory.CategoryId.ToString()!, id);
            update = update.Set(c => c.Image, path);
        }

        var updated = await _subcategories.UpdateOneAsync(
            c => c.Id.ToString() == id,
            update
        );
        return updated is not null && updated.ModifiedCount > 0;
    }

    public async Task<bool> UpdateSubcategoryProductTypesAsync(string id, HashSet<string> productTypes) {
        var updated = await _subcategories.UpdateOneAsync(
            c => c.Id.ToString() == id,
            Builders<Subcategory>.Update.Set(
                c => c.ProductTypes,
                StringUtils.ToLowerCase(productTypes)
            )
        );
        return updated is not null && updated.ModifiedCount > 0;
    }

    public async Task<bool> UpdateSubcategoryFiltersAsync(string id, HashSet<Filter> filters) {
        HashSet<Filter> lowercaseFilters = new();
        var productTypes = await _subcategories.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
        if (productTypes is null) return false;
        foreach (var filter in filters) {
            var products = StringUtils.ToLowerCase(filter.ProductTypes);
            products.IntersectWith(productTypes.ProductTypes);
            lowercaseFilters.Add(
                filter with {
                    Name = filter.Name.ToLower().Trim(),
                    Unit = filter.Unit.ToLower().Trim(),
                    ProductTypes = products
                }
            );
        }

        var updated = await _subcategories.UpdateOneAsync(
            c => c.Id.ToString() == id,
            Builders<Subcategory>.Update.Set(c => c.Filters, lowercaseFilters)
        );
        return updated is not null && updated.ModifiedCount > 0;
    }

    public async Task<bool> DeleteSubcategoryAsync(string id) {
        var subcategory = await _subcategories.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
        if (subcategory is null) return false;
        var categoryId = subcategory.CategoryId;
        var category = await _categories.Find(c => c.Id.Equals(categoryId)).FirstOrDefaultAsync();
        if (category is null) return false;

        var updated = await _categories.UpdateOneAsync(
            c => c.Id.Equals(categoryId),
            Builders<Category>.Update.Pull(c => c.SubcategoriesIds, subcategory.Id!.Value)
        );
        if (updated is null || updated.ModifiedCount == 0) return false;

        var deleted = await _subcategories.DeleteOneAsync(c => c.Id.ToString() == id);

        _fileUploadService.DeleteFile(subcategory.Image ?? "");
        return deleted is not null && deleted.DeletedCount > 0;
    }
}