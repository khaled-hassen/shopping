using Backend.Interfaces;
using Backend.Models;

namespace Backend.GraphQL.CategoryResolver;

[ExtendObjectType(typeof(Query))]
public class CategoryQuery {
    private readonly ICategoryService _categoryService;

    public CategoryQuery(ICategoryService categoryService) {
        _categoryService = categoryService;
    }

    public async Task<IEnumerable<Category>> GetCategories() {
        return await _categoryService.GetCategoriesAsync();
    }

    public async Task<Category?> GetCategory(string id) {
        return await _categoryService.GetCategoryAsync(id);
    }
}