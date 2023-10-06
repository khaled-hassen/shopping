using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class Category {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;

    public List<Subcategory> Subcategories { get; set; } = new();
}