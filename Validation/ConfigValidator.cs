using Backend.Models;
using FluentValidation;

namespace Backend.Validation;

public class ConfigValidator : AbstractValidator<Config> {
    public ConfigValidator() {
        RuleFor(c => c.HomeHeroCategoryId).NotNull().WithMessage("HomeHeroCategoryId is required");
        RuleFor(c => c.HeroCategoryId).NotNull().WithMessage("HeroCategoryId is required");
        RuleFor(c => c.HeroTitle).NotEmpty().WithMessage("HeroTitle is required");
        RuleFor(c => c.HeroSubtitle).NotEmpty().WithMessage("HeroSubtitle is required");
        RuleFor(c => c.HeroBgColor).NotEmpty().WithMessage("HeroBgColor is required");
        RuleFor(c => c.HeroActionBgColor).NotEmpty().WithMessage("HeroActionBgColor is required");
    }
}