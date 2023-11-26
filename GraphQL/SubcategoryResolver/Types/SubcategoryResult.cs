using Backend.Models;

namespace Backend.GraphQL.SubcategoryResolver.Types;

public class SubcategoryResult : Subcategory {
    public Category Category { get; set; } = null!;
}