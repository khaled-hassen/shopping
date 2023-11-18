﻿using Backend.Interfaces;
using Backend.Models;

namespace Backend.GraphQL.SubcategoryResolver;

[ExtendObjectType<Query>]
public class SubcategoryQuery {
    private readonly ISubcategoryService _subcategoryService;

    public SubcategoryQuery(ISubcategoryService subcategoryService) => _subcategoryService = subcategoryService;

    public async Task<List<Subcategory>?> GetSubcategories(string categoryId) => await _subcategoryService.GetSubcategoriesAsync(categoryId);

    public async Task<Subcategory?> GetSubcategory(string id) => await _subcategoryService.GetSubcategoryAsync(id);
}