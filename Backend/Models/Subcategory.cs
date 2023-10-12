using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class ProductType {
    [BsonId]
    public string? ObjectId { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;
}

public class Subcategory {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId? Id { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;

    public List<ProductType>? ProductTypes { get; set; } = new();
    public Dictionary<string, List<string>>? Filters { get; set; } = new();

    [BsonRequired]
    public ObjectId? CategoryId { get; set; }
}