namespace Backend.GraphQL.ProductResolver.Types;

public class CartProduct {
    public string Id { get; set; }
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal? Discount { get; set; }
    public string CoverImage { get; set; } = null!;
}