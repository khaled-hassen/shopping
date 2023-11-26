using Backend.Attributes;
using Backend.Exceptions;
using Backend.GraphQL.ProductResolver.Types;
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
    [Error<InvalidInputException>]
    public async Task<Store> CreateStore(string name, string description, IFile image, [GetUser] UserResult user) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(name, "Store name is required");
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(description, "Store description is required");
        return await _storeService.CreateStoreAsync(user, name, description, image);
    }

    [Authorize]
    [UseUser]
    [Error<InvalidInputException>]
    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateStore(string name, string description, IFile image, [GetUser] UserResult user) {
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(name, "Store name is required");
        Validator<NonEmptyStringValidator, string>.ValidateAndThrow(description, "Store description is required");
        await _storeService.UpdateStoreAsync(user, name, description, image);
        return true;
    }

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "created")]
    [Error<InvalidInputException>]
    public async Task<bool> CreateNewProduct(ProductInput product, [GetUserStore] Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");
        if (product.CoverImage.File is null) throw new InvalidInputException("Cover image is required");

        Validator<ProductValidator, ProductInput>.ValidateAndThrow(product);
        await _storeService.AddProductAsync(product, store);
        return true;
    }

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "updated")]
    [Error<InvalidInputException>]
    public async Task<bool> EditProduct(string id, ProductInput product, [GetUserStore] Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");

        Validator<ProductValidator, ProductInput>.ValidateAndThrow(product);
        await _storeService.UpdateProductAsync(id, product, store);
        return true;
    }

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "published")]
    [Error<InvalidInputException>]
    public async Task<bool> PublishProduct(string id, [GetUserStore] Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");
        await _storeService.PublishProductAsync(id, store);
        return true;
    }

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "unpublished")]
    [Error<InvalidInputException>]
    public async Task<bool> UnPublishProduct(string id, [GetUserStore] Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");
        await _storeService.UnPublishProductAsync(id, store);
        return true;
    }

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "deleted")]
    [Error<InvalidInputException>]
    public async Task<bool> DeleteProduct(string id, [GetUserStore] Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");
        await _storeService.DeleteProductAsync(id, store);
        return true;
    }
}