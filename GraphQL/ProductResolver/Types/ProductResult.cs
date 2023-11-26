namespace Backend.GraphQL.ProductResolver.Types;

public class ProductResult : StoreProductResult {
    public PublicStore Store { get; set; }
}