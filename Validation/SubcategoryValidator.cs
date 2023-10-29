using Backend.Models;
using FluentValidation;

namespace Backend.Validation;

public class SubcategoryValidator : AbstractValidator<Subcategory> {
    public SubcategoryValidator() {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Subcategory name cannot be empty");
        RuleFor(x => x.ProductTypes).NotEmpty().WithMessage("Products types cannot be empty");
        RuleForEach(x => x.ProductTypes).NotEmpty().WithMessage("Product type cannot be empty");
        RuleFor(x => x.Filters).NotEmpty().WithMessage("Filters cannot be empty");
        RuleForEach(x => x.Filters).SetValidator(new NonEmptyFilterValidator());
    }
}