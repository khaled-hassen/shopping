using Backend.Exceptions;
using Backend.Interfaces;
using Backend.Types;
using Backend.Validation;

namespace Backend.GraphQL.CategoryResolver;

[ExtendObjectType(typeof(Mutation))]
public class CategoryMutation {
    private readonly ICategoryService _categoryService;

    public CategoryMutation(ICategoryService categoryService) {
        _categoryService = categoryService;
    }

    [Error<InvalidInputExceptions>]
    public async Task<CreatedCategory> CreateCategory(string name, IFile image) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(name, "Category name cannot be empty");
        return await _categoryService.CreateCategoryAsync(name, image);
    }

    [Error<InvalidInputExceptions>]
    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateCategory(string id, string name, IFile? image) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(name, "Category name cannot be empty");
        return await _categoryService.UpdateCategoryAsync(id, name, image);
    }

    [UseMutationConvention(PayloadFieldName = "deleted")]
    public async Task<bool> DeleteCategory(string id) {
        return await _categoryService.DeleteCategoryAsync(id);
    }
}