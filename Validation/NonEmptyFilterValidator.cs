﻿using Backend.Models;
using FluentValidation;

namespace Backend.Validation;

public class NonEmptyFilterValidator : AbstractValidator<Filter> {
    public NonEmptyFilterValidator() {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Filter name cannot be empty");
        RuleFor(x => x.Type).NotNull().WithMessage("Filter type cannot be empty");
    }
}