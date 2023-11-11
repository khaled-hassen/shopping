using Backend.Types;

namespace Backend.GraphQL.UserResolver.Types;

public class UserAuthResult {
    public UserResult Result { get; set; } = null!;
    public RefreshToken RefreshToken { get; set; } = null!;
}