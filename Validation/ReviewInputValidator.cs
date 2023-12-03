using Backend.GraphQL.ReviewResolver.Types;
using FluentValidation;

namespace Backend.Validation;

public class ReviewInputValidator : AbstractValidator<NewReview> {
    public ReviewInputValidator() {
        RuleFor(c => c.Title).NotNull().WithMessage("Review title is required");
        RuleFor(c => c.Comment).NotNull().WithMessage("Review comment is required");
        RuleFor(c => c.Rating).Must(rating => rating <= 5 && rating >= 1).WithMessage("Rating must be between 1 and 5");
    }
}