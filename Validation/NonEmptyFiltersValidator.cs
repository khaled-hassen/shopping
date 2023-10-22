using Backend.Models;
using FluentValidation;

namespace Backend.Validation;

public class NonEmptyFiltersValidator : AbstractValidator<HashSet<Filter>> {
    public NonEmptyFiltersValidator() {
        RuleForEach(x => x).SetValidator(new NonEmptyFilterValidator());
    }
}