using Backend.Models;
using FluentValidation;

namespace Backend.Validation;

public class BillingDetailsValidator : AbstractValidator<BillingDetails> {
    public BillingDetailsValidator() {
        RuleFor(c => c.FirstName).NotNull().WithMessage("Firstname is required");
        RuleFor(c => c.LastName).NotNull().WithMessage("Lastname is required");
        RuleFor(c => c.Country).NotEmpty().WithMessage("Coutnry is required");
        RuleFor(c => c.City).NotEmpty().WithMessage("City is required");
        RuleFor(c => c.Address).NotEmpty().WithMessage("Address is required");
        RuleFor(c => c.State).NotEmpty().WithMessage("State is required");
        RuleFor(c => c.PostalCode).NotEmpty().WithMessage("PostalCode is required");
    }
}