using Backend.Interfaces;
using Backend.Models;

namespace Backend.GraphQL.SubcategoryResolver;

[ExtendObjectType(typeof(Mutation))]
public class SubcategoryMutation {
    private readonly ISubcategoryService _subcategoryService;

    public SubcategoryMutation(ISubcategoryService subcategoryService) {
        _subcategoryService = subcategoryService;
    }

    public async Task<Subcategory?> CreateSubcategory(string categoryId, Subcategory subcategory) {
        return await _subcategoryService.CreateSubcategoryAsync(categoryId, subcategory);
    }

    [UseMutationConvention(PayloadFieldName = "udpated")]
    public async Task<bool> UpdateSubcategoryName(string id, string name) {
        return await _subcategoryService.UpdateSubcategoryNameAsync(id, name);
    }

    [UseMutationConvention(PayloadFieldName = "udpated")]
    public async Task<bool> UpdateSubcategoryProductTypes(string id, HashSet<string> types) {
        return await _subcategoryService.UpdateSubcategoryProductTypesAsync(id, types);
    }


    [UseMutationConvention(PayloadFieldName = "udpated")]
    public async Task<bool> UpdateSubcategoryFilters(string id, Dictionary<string, HashSet<string>> filters) {
        return await _subcategoryService.UpdateSubcategoryFiltersAsync(id, filters);
    }

    [UseMutationConvention(PayloadFieldName = "deleted")]
    public async Task<bool> DeleteSubcategory(string id) {
        return await _subcategoryService.DeleteSubcategoryAsync(id);
    }
}