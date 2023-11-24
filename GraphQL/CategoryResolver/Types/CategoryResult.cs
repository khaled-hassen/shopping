using Backend.Models;

namespace Backend.GraphQL.CategoryResolver.Types;

public class CategoryResult : Category {
    public HashSet<Subcategory> Subcategories { get; set; } = null!;
}