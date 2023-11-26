using Backend.Models;

namespace Backend.GraphQL.ProductResolver.Types;

public class ProductLookupResult : Product {
    public List<Store> Stores { get; set; } = null!;
}