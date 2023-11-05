using Backend.Attributes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class Category {
    [BsonId]
    [GraphQLNonNullType]
    public ObjectId? Id { get; set; }

    [BsonRequired]
    [UniqueField]
    [GraphQLNonNullType]
    public string? Slug { get; set; }

    [BsonRequired]
    public string Name { get; set; } = null!;

    public HashSet<ObjectId> SubcategoriesIds { get; set; } = new();

    public string Image { get; set; } = null!;
}