using Backend.Attributes;
using Backend.Exceptions;
using Backend.GraphQL.ProductResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using Backend.Validation;
using HotChocolate.Authorization;

namespace Backend.GraphQL.ProductResolver;

[ExtendObjectType<Mutation>]
public class ProductMutation {
    private readonly IProductService _productService;

    public ProductMutation(IProductService productService) => _productService = productService;

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "created")]
    [Error<InvalidInputException>]
    public async Task<bool> CreateNewProduct(ProductInput product, [GetUserStore] Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");
        if (product.CoverImage.File is null) throw new InvalidInputException("Cover image is required");

        Validator<ProductValidator, ProductInput>.ValidateAndThrow(product);
        await _productService.AddProductAsync(product, store);
        return true;
    }

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "updated")]
    [Error<InvalidInputException>]
    public async Task<bool> EditProduct(string id, ProductInput product, [GetUserStore] Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");

        Validator<ProductValidator, ProductInput>.ValidateAndThrow(product);
        await _productService.UpdateProductAsync(id, product, store);
        return true;
    }

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "published")]
    [Error<InvalidInputException>]
    public async Task<bool> PublishProduct(string id, [GetUserStore] Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");
        await _productService.PublishProductAsync(id, store);
        return true;
    }

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "unpublished")]
    [Error<InvalidInputException>]
    public async Task<bool> UnPublishProduct(string id, [GetUserStore] Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");
        await _productService.UnPublishProductAsync(id, store);
        return true;
    }
}