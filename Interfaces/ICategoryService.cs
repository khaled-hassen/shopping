using Backend.GraphQL.CategoryResolver.Types;

namespace Backend.Interfaces;

public interface ICategoryService {
    public Task<List<CategoryResult>> GetCategoriesAsync();
    public Task<List<CategoryResult>> GetTopCategoriesAsync();
    public Task<CategoryResult?> GetCategoryAsync(string slug);
    public Task<CreatedCategory> CreateCategoryAsync(string name, IFile image);
    public Task<bool> UpdateCategoryAsync(string id, string name, IFile? image);
    public Task<bool> DeleteCategoryAsync(string id);
}