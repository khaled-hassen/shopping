using Backend.Interfaces;
using Backend.Models;

namespace Backend.GraphQL.SubcategoryResolver;

[ExtendObjectType(typeof(Mutation))]
public class SubcategoryMutation {
    private readonly ISubcategoryService _subcategoryService;

    public SubcategoryMutation(ISubcategoryService subcategoryService) {
        _subcategoryService = subcategoryService;
    }

    public async Task<Subcategory?> CreateSubcategory(string categoryId, Subcategory subcategory, IFile image) {
        return await _subcategoryService.CreateSubcategoryAsync(categoryId, subcategory, image);
    }

    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateSubcategory(string id, string name, IFile? image) {
        return await _subcategoryService.UpdateSubcategoryAsync(id, name, image);
    }

    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateSubcategoryProductTypes(string id, HashSet<string> types) {
        return await _subcategoryService.UpdateSubcategoryProductTypesAsync(id, types);
    }


    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateSubcategoryFilters(string id, Dictionary<string, HashSet<string>> filters) {
        return await _subcategoryService.UpdateSubcategoryFiltersAsync(id, filters);
    }

    [UseMutationConvention(PayloadFieldName = "deleted")]
    public async Task<bool> DeleteSubcategory(string id) {
        return await _subcategoryService.DeleteSubcategoryAsync(id);
    }
}