using Backend.Attributes;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Types;
using HotChocolate.Authorization;

namespace Backend.GraphQL.UserResolver;

[ExtendObjectType<Query>]
public class UserQuery {
    private readonly IUserService _userService;

    public UserQuery(IUserService userService) => _userService = userService;


    [Authorize]
    [UseUser]
    public UserResult GetMe([GetUser] UserResult user) => user;

    public async Task<AuthUserResult> Login(string email, string password, [Service] IHttpContextAccessor httpContextAccessor) {
        LoginResult? user = await _userService.LoginAsync(email, password);
        if (user is null) throw new GraphQLException(new Error("Wrong credentials", ErrorCodes.WrongCredentials));
        if (httpContextAccessor.HttpContext is null) return user.Result;

        RefreshToken refreshToken = user.RefreshToken;
        var cookieOptions = new CookieOptions {
            HttpOnly = true,
            Expires = refreshToken.ExpireDate
        };
        httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken.Value, cookieOptions);
        return user.Result;
    }

    public async Task<AuthUserResult?> RefreshAccessToken([Service] IHttpContextAccessor httpContextAccessor) {
        string? refreshToken = httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
        if (refreshToken is null) throw new GraphQLException(new Error("Not authorized", ErrorCodes.UnauthorizedCode));
        return await _userService.RefreshAccessTokenAsync(refreshToken);
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