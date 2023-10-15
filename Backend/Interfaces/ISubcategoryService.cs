using Backend.Models;

namespace Backend.Interfaces;

public interface ISubcategoryService {
    public Task<List<Subcategory>?> GetSubcategoriesAsync(string categoryId);
    public Task<Subcategory?> GetSubcategoryAsync(string id);
    public Task<Subcategory?> CreateSubcategoryAsync(string categoryId, Subcategory subcategory);
    public Task<bool> UpdateSubcategoryNameAsync(string id, string name);
    public Task<bool> UpdateSubcategoryProductTypesAsync(string id, HashSet<string> productTypes);
    public Task<bool> UpdateSubcategoryFiltersAsync(string id, Dictionary<string, HashSet<string>> filters);
    public Task<bool> DeleteSubcategoryAsync(string id);
}