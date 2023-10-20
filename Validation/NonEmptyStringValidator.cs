using FluentValidation;

namespace Backend.Validation;

public class NonEmptyStringValidator : AbstractValidator<string> {
    public NonEmptyStringValidator() {
        RuleFor(x => x).NotEmpty().WithMessage("String cannot be empty.");
    }
}