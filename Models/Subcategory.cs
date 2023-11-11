using Backend.Attributes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public enum FilterType {
    String,
    Number,
    Boolean
}

public record Filter(string Name, FilterType Type, string Unit, HashSet<string> ProductTypes);

public class Subcategory {
    [BsonId]
    [GraphQLNonNullType]
    public ObjectId? Id { get; set; }

    [BsonRequired]
    [UniqueField]
    [GraphQLNonNullType]
    public string? Slug { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;

    public HashSet<string> ProductTypes { get; set; } = null!;
    public HashSet<Filter> Filters { get; set; } = null!;

    [BsonRequired]
    [GraphQLNonNullType]
    public ObjectId? CategoryId { get; set; }

    [BsonRequired]
    [GraphQLNonNullType]
    public string? Image { get; set; }
}