using Backend.Attributes;
using Backend.Exceptions;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using Backend.Validation;
using HotChocolate.Authorization;

namespace Backend.GraphQL.UserResolver;

[ExtendObjectType<Mutation>]
public class UserMutation {
    private readonly IUserService _userService;

    public UserMutation(IUserService userService) => _userService = userService;

    [UseMutationConvention(PayloadFieldName = "emailSent")]
    [Error<InvalidInputExceptions>]
    [Error<UserExistException>]
    public async Task<bool> CreateAccount(
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        string password,
        string passwordConfirmation
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
        await _userService.CreateAccountAsync(firstName, lastName, email, phoneNumber, password);
        return true;
    }

    [UseMutationConvention(PayloadFieldName = "success")]
    [Authorize]
    [UseUser]
    public async Task<bool> Logout([Service] IHttpContextAccessor httpContextAccessor, [GetUser] UserResult user) {
        string? refreshToken = httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
        await _userService.LogoutAsync(user.Id, refreshToken);
        httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken");
        return true;
    }

    [UseMutationConvention(PayloadFieldName = "success")]
    [Error<UnauthorizedException>]
    public async Task<bool> VerifyEmail(string token) {
        await _userService.VerifyEmailAsync(token);
        return true;
    }

    [UseMutationConvention(PayloadFieldName = "success")]
    [Error<InvalidInputExceptions>]
    [Error<UnauthorizedException>]
    public async Task<bool> ResetPassword(string token, string newPassword, string newPasswordConfirmation) {
        Validator<PasswordUpdateValidator, PasswordUpdateValidatorInput>.ValidateAndThrow(
            new PasswordUpdateValidatorInput {
                Password = newPassword, PasswordConfirmation = newPasswordConfirmation
            }
        );
        await _userService.ResetPasswordAsync(token, newPassword);
        return true;
    }

    [Authorize]
    [UseUser]
    [Error<InvalidInputExceptions>]
    public async Task<PersonalDataEditResult> UpdatePersonalData(
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        [GetUser] UserResult user
    ) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(firstName, "First name is required");
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(lastName, "Last name is required");
        Validator<EmailValidator, string>.ValidateAndThrow(email);
        Validator<PhoneNumberValidator, string>.ValidateAndThrow(phoneNumber);
        return await _userService.UpdatePersonalDataAsync(user, firstName, lastName, phoneNumber, email);
    }

    [UseMutationConvention(PayloadFieldName = "updated")]
    [Error<InvalidInputExceptions>]
    [Authorize]
    [UseUser]
    public async Task<bool> UpdateBillingDetails(BillingDetails details, [GetUser] UserResult user) {
        Validator<BillingDetailsValidator, BillingDetails>.ValidateAndThrow(details);
        await _userService.UpdateBillingDetailsAsync(user, details);
        return true;
    }

    [UseMutationConvention(PayloadFieldName = "updated")]
    [Error<InvalidInputExceptions>]
    [Authorize]
    [UseUser]
    public async Task<bool> UpdatePassword(string oldPassword, string newPassword, string newPasswordConfirmation, [GetUser] UserResult user) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(oldPassword, "Old password is required");
        Validator<PasswordUpdateValidator, PasswordUpdateValidatorInput>.ValidateAndThrow(
            new PasswordUpdateValidatorInput {
                Password = newPassword,
                PasswordConfirmation = newPasswordConfirmation
            }
        );
        await _userService.UpdatePasswordAsync(user, oldPassword, newPassword);
        return true;
    }
}