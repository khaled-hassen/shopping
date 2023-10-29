using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public enum FilterType {
    String,
    Number
}

public record Filter(string Name, FilterType Type, string Unit, HashSet<string> ProductTypes);

public class Subcategory {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId? Id { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;

    public HashSet<string> ProductTypes { get; set; } = null!;
    public HashSet<Filter> Filters { get; set; } = null!;

    [BsonRequired]
    public ObjectId? CategoryId { get; set; }

    [BsonRequired]
    public string? Image { get; set; }
}