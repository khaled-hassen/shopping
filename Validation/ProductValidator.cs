using Backend.GraphQL.ProductResolver.Types;
using FluentValidation;

namespace Backend.Validation;

public class ProductValidator : AbstractValidator<ProductInput> {
    public ProductValidator() {
        RuleFor(c => c.Name).NotEmpty().WithMessage("Name is required");
        RuleFor(c => c.BriefDescription).NotEmpty().WithMessage("Brief description is required");
        RuleFor(c => c.Description).NotEmpty().WithMessage("Description is required");
        RuleFor(c => c.Price).NotEmpty().WithMessage("Price is required");
        RuleFor(c => c.CategoryId).NotEmpty().WithMessage("Category is required");
        RuleFor(c => c.SubcategoryId).NotEmpty().WithMessage("Subcategory is required");
        RuleFor(c => c.ProductType).NotEmpty().WithMessage("ProductType is required");
        RuleFor(c => c.Details).NotEmpty().WithMessage("Details are required");
    }
}