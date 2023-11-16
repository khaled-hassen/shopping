using FluentValidation;

namespace Backend.Validation;

public class PasswordResetValidatorInput {
    public string Password { get; set; } = null!;
    public string PasswordConfirmation { get; set; } = null!;
}

public class PasswordResetValidator : AbstractValidator<PasswordResetValidatorInput> {
    public PasswordResetValidator() {
        RuleFor(c => c.Password).NotEmpty().WithMessage("Password is required").MinimumLength(8)
            .WithMessage("Password must be at least 8 characters");
        RuleFor(c => c.PasswordConfirmation)
            .NotEmpty().WithMessage("Password confirmation is required")
            .Equal(c => c.Password).WithMessage("Password confirmation do not match");
    }
}