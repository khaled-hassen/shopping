using Backend.Attributes;
using Backend.Exceptions;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Types;
using Backend.Validation;
using HotChocolate.Authorization;

namespace Backend.GraphQL.UserResolver;

[ExtendObjectType(typeof(Mutation))]
public class UserMutation {
    private readonly IUserService _userService;

    public UserMutation(IUserService userService) {
        _userService = userService;
    }

    [Error<InvalidInputExceptions>]
    [Error<UserExistException>]
    public async Task<UserResult> CreateUser(
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        string password,
        string passwordConfirmation,
        [Service] IHttpContextAccessor httpContextAccessor
    ) {
        Validator<UserRegisterValidator, UserInput>.ValidateAndThrow(
            new UserInput {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PhoneNumber = phoneNumber,
                Password = password,
                PasswordConfirmation = passwordConfirmation
            }
        );
        var user = await _userService.CreateUserAsync(firstName, lastName, email, phoneNumber, password);
        if (httpContextAccessor.HttpContext is null) return user.Result;

        var refreshToken = user.RefreshToken;
        var cookieOptions = new CookieOptions {
            HttpOnly = true,
            Expires = refreshToken.ExpireDate
        };
        httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken.Value, cookieOptions);
        return user.Result;
    }

    [Authorize]
    [UseUser]
    public async Task<AccessToken> RefreshAccessToken([Service] IHttpContextAccessor httpContextAccessor, [GetUser] UserResult user) {
        var refreshToken = httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
        if (refreshToken is null) throw new GraphQLException(new Error("Not authorized", ErrorCodes.UnauthorizedCode));
        return await _userService.RefreshAccessTokenAsync(user.Id, refreshToken);
    }

    [UseMutationConvention(PayloadFieldName = "success")]
    [Authorize]
    [UseUser]
    public async Task<bool> Logout([Service] IHttpContextAccessor httpContextAccessor, [GetUser] UserResult user) {
        var refreshToken = httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
        await _userService.LogoutAsync(user.Id, refreshToken);
        httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken");
        return true;
    }
}