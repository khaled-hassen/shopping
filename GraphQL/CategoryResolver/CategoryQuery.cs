using Backend.GraphQL.CategoryResolver.Types;
using Backend.Interfaces;

namespace Backend.GraphQL.CategoryResolver;

[ExtendObjectType<Query>]
public class CategoryQuery {
    private readonly ICategoryService _categoryService;

    public CategoryQuery(ICategoryService categoryService) => _categoryService = categoryService;

    public async Task<List<CategoryResult>> GetCategories() => await _categoryService.GetCategoriesAsync();


    public async Task<CategoryResult?> GetCategory(string id) => await _categoryService.GetCategoryAsync(id);

    public async Task<List<CategoryResult>> GetTopCategories() => await _categoryService.GetTopCategoriesAsync();
}