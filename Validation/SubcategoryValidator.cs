using Backend.Models;
using FluentValidation;

namespace Backend.Validation;

public class SubcategoryValidator : AbstractValidator<Subcategory> {
    public SubcategoryValidator() {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Subcategory name cannot be empty");
        RuleForEach(x => x.ProductTypes).NotEmpty().WithMessage("Product type cannot be empty");
        RuleForEach(x => x.Filters).SetValidator(new NonEmptyFilterValidator());
    }
}