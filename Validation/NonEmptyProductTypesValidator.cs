using FluentValidation;

namespace Backend.Validation;

public class NonEmptyProductTypesValidator : AbstractValidator<HashSet<string>> {
    public NonEmptyProductTypesValidator() {
        RuleForEach(types => types).NotEmpty().WithMessage("Product type cannot be empty");
    }
}