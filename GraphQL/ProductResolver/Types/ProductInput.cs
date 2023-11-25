using MongoDB.Bson;

namespace Backend.GraphQL.ProductResolver.Types;

public class ProductImage {
    public IFile? File { get; set; }
    public bool NewImage { get; set; }
}

public class ProductInput {
    public string Name { get; set; } = null!;
    public string BriefDescription { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal? Discount { get; set; }
    public decimal? ShipmentPrice { get; set; }
    public ObjectId CategoryId { get; set; }
    public ObjectId SubcategoryId { get; set; }
    public string ProductType { get; set; } = null!;
    public ProductImage CoverImage { get; set; } = null!;
    public HashSet<ProductImage> Images { get; set; } = null!;

    [GraphQLType<AnyType>]
    public object Details { get; set; } = null!;
}