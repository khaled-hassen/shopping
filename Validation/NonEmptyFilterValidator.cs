using FluentValidation;

namespace Backend.Validation;

public class NonEmptyFilterValidator : AbstractValidator<KeyValuePair<string, HashSet<string>>> {
    public NonEmptyFilterValidator() {
        RuleFor(x => x.Key).NotEmpty().WithMessage("Filter name cannot be empty");
        RuleForEach(x => x.Value).NotEmpty().WithMessage("Filter value cannot be empty");
    }
}