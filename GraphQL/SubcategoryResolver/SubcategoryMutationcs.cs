using Backend.Exceptions;
using Backend.Interfaces;
using Backend.Models;
using Backend.Validation;
using HotChocolate.Authorization;

namespace Backend.GraphQL.SubcategoryResolver;

[ExtendObjectType<Mutation>]
public class SubcategoryMutation {
    private readonly ISubcategoryService _subcategoryService;

    public SubcategoryMutation(ISubcategoryService subcategoryService) => _subcategoryService = subcategoryService;

    [Authorize(Roles = new[] { "Admin" })]
    [Error<InvalidInputExceptions>]
    public async Task<Subcategory?> CreateSubcategory(string categoryId, Subcategory subcategory, IFile image) {
        Validator<SubcategoryValidator, Subcategory>.ValidateAndThrow(subcategory);
        return await _subcategoryService.CreateSubcategoryAsync(categoryId, subcategory, image);
    }

    [Authorize(Roles = new[] { "Admin" })]
    [Error<InvalidInputExceptions>]
    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateSubcategory(string id, string name, IFile? image) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(name, "Subcategory name cannot be empty");
        return await _subcategoryService.UpdateSubcategoryAsync(id, name, image);
    }

    [Authorize(Roles = new[] { "Admin" })]
    [Error<InvalidInputExceptions>]
    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateSubcategoryProductTypes(string id, HashSet<string> types) {
        Validator<NonEmptyProductTypesValidator, HashSet<string>>.ValidateAndThrow(types);
        return await _subcategoryService.UpdateSubcategoryProductTypesAsync(id, types);
    }


    [Authorize(Roles = new[] { "Admin" })]
    [Error<InvalidInputExceptions>]
    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateSubcategoryFilters(string id, HashSet<Filter> filters) {
        Validator<NonEmptyFiltersValidator, HashSet<Filter>>.ValidateAndThrow(filters);
        return await _subcategoryService.UpdateSubcategoryFiltersAsync(id, filters);
    }

    [Authorize(Roles = new[] { "Admin" })]
    [UseMutationConvention(PayloadFieldName = "deleted")]
    public async Task<bool> DeleteSubcategory(string id) => await _subcategoryService.DeleteSubcategoryAsync(id);
}