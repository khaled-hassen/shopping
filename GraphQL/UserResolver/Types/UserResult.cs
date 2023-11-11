using Backend.Types;
using MongoDB.Bson;

namespace Backend.GraphQL.UserResolver.Types;

public class UserResult {
    public ObjectId Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public AccessToken AccessToken { get; set; } = null!;
}