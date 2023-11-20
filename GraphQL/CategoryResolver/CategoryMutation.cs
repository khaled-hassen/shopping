using Backend.Exceptions;
using Backend.GraphQL.CategoryResolver.Types;
using Backend.Interfaces;
using Backend.Validation;
using HotChocolate.Authorization;

namespace Backend.GraphQL.CategoryResolver;

[ExtendObjectType<Mutation>]
public class CategoryMutation {
    private readonly ICategoryService _categoryService;

    public CategoryMutation(ICategoryService categoryService) => _categoryService = categoryService;

    [Authorize(Roles = new[] { "Admin" })]
    [Error<InvalidInputException>]
    public async Task<CreatedCategory> CreateCategory(string name, IFile image) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(name, "Category name cannot be empty");
        return await _categoryService.CreateCategoryAsync(name, image);
    }

    [Authorize(Roles = new[] { "Admin" })]
    [Error<InvalidInputException>]
    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateCategory(string id, string name, IFile? image) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(name, "Category name cannot be empty");
        return await _categoryService.UpdateCategoryAsync(id, name, image);
    }

    [Authorize(Roles = new[] { "Admin" })]
    [UseMutationConvention(PayloadFieldName = "deleted")]
    public async Task<bool> DeleteCategory(string id) => await _categoryService.DeleteCategoryAsync(id);
}