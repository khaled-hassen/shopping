using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class Product {
    [BsonId]
    [GraphQLNonNullType]
    public ObjectId? Id { get; set; }

    public ObjectId SellerId { get; set; }
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
    public HashSet<ObjectId>? ReviewsIds { get; set; }
    public string CoverImage { get; set; } = null!;
    public HashSet<string> Images { get; set; } = null!;

    [GraphQLType<AnyType>]
    public object Details { get; set; } = null!;

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    public bool Published { get; set; } = false;
}