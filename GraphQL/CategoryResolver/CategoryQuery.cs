using Backend.GraphQL.CategoryResolver.Types;
using Backend.Interfaces;

namespace Backend.GraphQL.CategoryResolver;

[ExtendObjectType(typeof(Query))]
public class CategoryQuery {
    private readonly ICategoryService _categoryService;

    public CategoryQuery(ICategoryService categoryService) {
        _categoryService = categoryService;
    }

    public async Task<List<CategoryResult>> GetCategories() {
        return await _categoryService.GetCategoriesAsync();
    }

    public async Task<CategoryResult?> GetCategory(string id) {
        return await _categoryService.GetCategoryAsync(id);
    }
}