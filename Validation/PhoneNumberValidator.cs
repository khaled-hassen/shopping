using FluentValidation;

namespace Backend.Validation;

public class PhoneNumberValidator : AbstractValidator<string> {
    public PhoneNumberValidator() {
        RuleFor(c => c).NotEmpty().WithMessage("Phone number is required").MinimumLength(7)
            .WithMessage("Phone number must be at least 7 characters")
            .MaximumLength(15).WithMessage("Phone number must be at most 15 characters")
            .Matches("^\\+?[0-9]+$").WithMessage("Invalid phone number");
    }
}