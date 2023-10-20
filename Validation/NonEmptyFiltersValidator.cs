using FluentValidation;

namespace Backend.Validation;

public class NonEmptyFiltersValidator : AbstractValidator<Dictionary<string, HashSet<string>>> {
    public NonEmptyFiltersValidator() {
        RuleForEach(x => x).SetValidator(new NonEmptyFilterValidator());
    }
}