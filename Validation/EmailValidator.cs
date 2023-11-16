using FluentValidation;

namespace Backend.Validation;

public class EmailValidator : AbstractValidator<string> {
    public EmailValidator() {
        RuleFor(c => c).NotEmpty().WithMessage("Email is required").EmailAddress().WithMessage("Email is not valid");
    }
}