using Backend.Models;

namespace Backend.Interfaces;

public interface ICategoryService {
    public Task<IEnumerable<Category>> GetCategoriesAsync();
    public Task<Category?> GetCategoryAsync(string id);
    public Task<Category> CreateCategoryAsync(string name);
    public Task<bool> UpdateCategoryNameAsync(string id, string name);
    public Task<bool> DeleteCategoryAsync(string id);
}