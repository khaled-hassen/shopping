using Backend.GraphQL.SubcategoryResolver.Types;
using Backend.Models;

namespace Backend.Interfaces;

public interface ISubcategoryService {
    public Task<List<Subcategory>?> GetSubcategoriesAsync(string categoryId);
    public Task<SubcategoryResult?> GetSubcategoryAsync(string slug);
    public Task<Subcategory?> CreateSubcategoryAsync(string categoryId, Subcategory subcategory, IFile image);
    public Task<bool> UpdateSubcategoryAsync(string id, string name, IFile? image);
    public Task<bool> UpdateSubcategoryProductTypesAsync(string id, HashSet<string> productTypes);
    public Task<bool> UpdateSubcategoryFiltersAsync(string id, HashSet<Filter> filters);
    public Task<bool> DeleteSubcategoryAsync(string id);
}