using Backend.Models;

namespace Backend.GraphQL.SubcategoryResolver.Types;

public class SubcategoryLookupResult : Subcategory {
    public List<Category> Categories { get; set; } = null!;
}