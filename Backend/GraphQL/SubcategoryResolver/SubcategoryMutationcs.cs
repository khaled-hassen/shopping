using Backend.Interfaces;

namespace Backend.GraphQL.SubcategoryResolver;

[ExtendObjectType(typeof(Mutation))]
public class SubcategoryMutation {
    private readonly ISubcategoryService _subcategoryService;

    public SubcategoryMutation(ISubcategoryService subcategoryService) {
        _subcategoryService = subcategoryService;
    }

    [UseMutationConvention(PayloadFieldName = "deleted")]
    public async Task<bool> DeleteSubcategory(string id) {
        return await _subcategoryService.DeleteSubcategoryAsync(id);
    }
}