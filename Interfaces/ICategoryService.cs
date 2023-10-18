using Backend.Models;
using Backend.Types;

namespace Backend.Interfaces;

public record DeletedCategory(string categoryImage, List<string> subcategoriesImages);

public interface ICategoryService {
    public Task<List<CategoryResult>> GetCategoriesAsync();
    public Task<CategoryResult?> GetCategoryAsync(string id);
    public Task<CreatedCategory> CreateCategoryAsync(string name, IFile image);
    public Task<bool> UpdateCategoryNameAsync(string id, string name);
    public Task<bool> DeleteCategoryAsync(string id);
}