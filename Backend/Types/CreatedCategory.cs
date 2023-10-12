using Backend.Models;

namespace Backend.Types;

public record CreatedCategory(
    string Id,
    string Name,
    HashSet<Subcategory> Subcategories
);