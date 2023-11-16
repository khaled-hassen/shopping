using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;

namespace Backend.GraphQL.UserResolver;

[ExtendObjectType(typeof(Query))]
public class UserQuery {
    private readonly IUserService _userService;

    public UserQuery(IUserService userService) {
        _userService = userService;
    }

    public async Task<UserResult> Login(string email, string password, [Service] IHttpContextAccessor httpContextAccessor) {
        var user = await _userService.LoginAsync(email, password);
        if (user is null) throw new GraphQLException(new Error("Wrong credentials", ErrorCodes.WrongCredentials));
        if (httpContextAccessor.HttpContext is null) return user.Result;

        var refreshToken = user.RefreshToken;
        var cookieOptions = new CookieOptions {
            HttpOnly = true,
            Expires = refreshToken.ExpireDate
        };
        httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken.Value, cookieOptions);
        return user.Result;
    }

    public async Task<bool> SendEmailVerificationEmail(string email) {
        await _userService.SendEmailVerificationEmailAsync(email);
        return true;
    }

    public async Task<bool> SendPasswordResetEmail(string email) {
        await _userService.SendPasswordResetEmailAsync(email);
        return true;
    }
}