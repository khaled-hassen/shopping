using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class Subcategory {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId? Id { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;

    public HashSet<string>? ProductTypes { get; set; } = new();
    public Dictionary<string, HashSet<string>>? Filters { get; set; } = new();

    [BsonRequired]
    public ObjectId? CategoryId { get; set; }
}