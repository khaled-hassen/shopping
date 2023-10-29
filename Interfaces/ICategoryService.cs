using Backend.GraphQL.CategoryResolver.Types;

namespace Backend.Interfaces;

public record DeletedCategory(string categoryImage, List<string> subcategoriesImages);

public interface ICategoryService {
    public Task<List<CategoryResult>> GetCategoriesAsync();
    public Task<CategoryResult?> GetCategoryAsync(string id);
    public Task<CreatedCategory> CreateCategoryAsync(string name, IFile image);
    public Task<bool> UpdateCategoryAsync(string id, string name, IFile? image);
    public Task<bool> DeleteCategoryAsync(string id);
}