using MongoDB.Bson;

namespace Backend.GraphQL.ProductResolver.Types;

public class ProductInput {
    public string Name { get; set; } = null!;
    public string BriefDescription { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal? Discount { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public decimal? ShipmentPrice { get; set; }
    public ObjectId CategoryId { get; set; }
    public ObjectId SubcategoryId { get; set; }
    public string ProductType { get; set; } = null!;
    public IFile CoverImage { get; set; } = null!;
    public HashSet<IFile> Images { get; set; } = null!;
    public object Details { get; set; } = null!;
}