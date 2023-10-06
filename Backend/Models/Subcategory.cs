using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class Type {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;
}

public class Subcategory {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;

    private List<Type> Types { get; set; } = new();
    public Dictionary<string, List<string>> Filters { get; set; } = new();
}