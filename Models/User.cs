using Backend.Attributes;
using Backend.Types;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class User {
    [BsonId]
    [GraphQLNonNullType]
    public ObjectId? Id { get; set; }

    [UniqueField]
    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Password { get; set; } = null!;
    public HashSet<RefreshToken> RefreshTokens { get; set; } = new();
    public DateTime? EmailVerifiedAt { get; set; } = null;
}