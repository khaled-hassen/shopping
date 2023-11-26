namespace Backend.GraphQL.ProductResolver.Types;

public class ProductResult : StoreProductResult {
    public PublicStore Store { get; set; }
    public List<ProductResult>? RelatedProducts { get; set; }
}