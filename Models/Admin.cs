using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class Admin {
    [BsonId]
    public ObjectId? Id { get; set; }

    [BsonRequired]
    public string Email { get; set; } = null!;

    [BsonRequired]
    public string Password { get; set; } = null!;
}