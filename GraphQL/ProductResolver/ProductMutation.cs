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
        Validator<ProductValidator, ProductInput>.ValidateAndThrow(product);
        await _productService.AddProductAsync(product, store);
        return true;
    }
}