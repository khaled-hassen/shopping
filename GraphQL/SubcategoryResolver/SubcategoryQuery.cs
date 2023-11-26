using Backend.GraphQL.SubcategoryResolver.Types;
using Backend.Interfaces;
using Backend.Models;

namespace Backend.GraphQL.SubcategoryResolver;

[ExtendObjectType<Query>]
public class SubcategoryQuery {
    private readonly ISubcategoryService _subcategoryService;

    public SubcategoryQuery(ISubcategoryService subcategoryService) => _subcategoryService = subcategoryService;

    public async Task<List<Subcategory>?> GetSubcategories(string categoryId) => await _subcategoryService.GetSubcategoriesAsync(categoryId);

    public async Task<SubcategoryResult?> GetSubcategory(string slug) => await _subcategoryService.GetSubcategoryAsync(slug);
}