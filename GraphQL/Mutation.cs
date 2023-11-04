using Backend.Exceptions;
using Backend.Interfaces;
using Backend.Models;
using Backend.Validation;
using HotChocolate.Authorization;
using MongoDB.Bson;

namespace Backend.GraphQL;

public class Mutation {
    private readonly IConfigService _service;

    public Mutation(IConfigService service) {
        _service = service;
    }

    [Authorize(Roles = new[] { "Admin" })]
    [Error<InvalidInputExceptions>]
    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateConfig(
        string homeHeroCategoryId,
        string heroCategoryId,
        string heroTitle,
        string heroSubtitle,
        string heroBgColor,
        string heroActionBgColor
    ) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(homeHeroCategoryId, "homeHeroCategoryId is required");
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(heroCategoryId, "heroCategoryId is required");
        var config = new Config {
            HomeHeroCategoryId = ObjectId.Parse(homeHeroCategoryId),
            HeroCategoryId = ObjectId.Parse(heroCategoryId),
            HeroTitle = heroTitle,
            HeroSubtitle = heroSubtitle,
            HeroBgColor = heroBgColor,
            HeroActionBgColor = heroActionBgColor
        };
        Validator<ConfigValidator, Config>.ValidateAndThrow(config);
        return await _service.UpdateConfigAsync(config);
    }
}