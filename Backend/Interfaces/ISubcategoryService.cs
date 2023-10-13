using Backend.Models;

namespace Backend.Interfaces;

public interface ISubcategoryService {
    public Task<List<Subcategory>> GetSubcategoriesAsync(string categoryId);
    public Task<Subcategory?> GetSubcategoryAsync(string id);
    public Task<Subcategory?> CreateCategoryAsync(string categoryId, Subcategory subcategory);
    public Task<bool> UpdateSubcategoryAsync(string id, Subcategory subcategory);
    public Task<bool> DeleteSubcategoryAsync(string id);
}