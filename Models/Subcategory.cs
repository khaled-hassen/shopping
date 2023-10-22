using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public enum FilterType {
    String,
    Number
}

public record Filter(string Name, FilterType Type, string Unit);

public class Subcategory {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId? Id { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;

    public HashSet<string>? ProductTypes { get; set; } = new();
    public HashSet<Filter>? Filters { get; set; } = new();

    [BsonRequired]
    public ObjectId? CategoryId { get; set; }

    [BsonRequired]
    public string? Image { get; set; }
}