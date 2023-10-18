using Backend.Interfaces;
using Backend.Types;

namespace Backend.GraphQL.CategoryResolver;

[ExtendObjectType(typeof(Mutation))]
public class CategoryMutation {
    private readonly ICategoryService _categoryService;

    public CategoryMutation(ICategoryService categoryService) {
        _categoryService = categoryService;
    }

    public async Task<CreatedCategory> CreateCategory(string name) {
        return await _categoryService.CreateCategoryAsync(name);
    }

    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateCategory(string id, string name) {
        return await _categoryService.UpdateCategoryNameAsync(id, name);
    }

    [UseMutationConvention(PayloadFieldName = "deleted")]
    public async Task<bool> DeleteCategory(string id) {
        return await _categoryService.DeleteCategoryAsync(id);
    }
}