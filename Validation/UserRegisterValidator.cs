using FluentValidation;

namespace Backend.Validation;

public class UserInput {
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string PasswordConfirmation { get; set; } = null!;
}

public class UserRegisterValidator : AbstractValidator<UserInput> {
    public UserRegisterValidator() {
        RuleFor(c => c.FirstName).NotEmpty().WithMessage("First name is required");
        RuleFor(c => c.LastName).NotEmpty().WithMessage("Last name is required");
        RuleFor(c => c.Email).NotEmpty().WithMessage("Email is required").EmailAddress().WithMessage("Email is not valid");
        RuleFor(c => c.PhoneNumber).NotEmpty().WithMessage("Phone number is required").MinimumLength(7)
            .WithMessage("Phone number must be at least 7 characters")
            .MaximumLength(15).WithMessage("Phone number must be at most 15 characters")
            .Matches("^\\+?[0-9]+$").WithMessage("Invalid phone number");
        RuleFor(c => c.Password).NotEmpty().WithMessage("Password is required").MinimumLength(8)
            .WithMessage("Password must be at least 8 characters");
        RuleFor(c => c.PasswordConfirmation)
            .NotEmpty().WithMessage("Password confirmation is required")
            .Equal(c => c.Password).WithMessage("Confirm password do not match");
    }
}