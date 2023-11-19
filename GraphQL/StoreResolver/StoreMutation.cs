﻿using Backend.Attributes;
using Backend.Exceptions;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using Backend.Validation;
using HotChocolate.Authorization;

namespace Backend.GraphQL.StoreResolver;

[ExtendObjectType<Mutation>]
public class StoreMutation {
    private readonly IStoreService _storeService;

    public StoreMutation(IStoreService storeService) => _storeService = storeService;

    [Authorize]
    [UseUser]
    [Error<InvalidInputExceptions>]
    public async Task<Store> CreateStore(string name, string description, IFile image, [GetUser] UserResult user) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(name, "Store name is required");
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(description, "Store description is required");
        return await _storeService.CreateStoreAsync(user, name, description, image);
    }
}