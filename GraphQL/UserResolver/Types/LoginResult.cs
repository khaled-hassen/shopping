using Backend.Types;

namespace Backend.GraphQL.UserResolver.Types;

public class LoginResult {
    public AuthUserResult Result { get; set; } = null!;
    public RefreshToken RefreshToken { get; set; } = null!;
}