using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class Review {
    [BsonId]
    [GraphQLNonNullType]
    public ObjectId? Id { get; set; }

    public ObjectId ReviewerId { get; set; }
    public ObjectId ProductId { get; set; }
    public string Title { get; set; } = null!;
    public byte Rating { get; set; }
    public string Comment { get; set; } = null!;
    public DateTime PostDate { get; set; }
}