using Backend.Models;

namespace Backend.GraphQL.ProductResolver.Types;

public class StoreProduct : Product {
    public List<Category> Categories { get; set; } = null!;
}