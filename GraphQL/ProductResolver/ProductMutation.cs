using Backend.Attributes;
using Backend.GraphQL.ProductResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using HotChocolate.Authorization;

namespace Backend.GraphQL.ProductResolver;

[ExtendObjectType<Mutation>]
public class ProductMutation {
    private readonly IProductService _productService;

    public ProductMutation(IProductService productService) => _productService = productService;

    [UseMutationConvention(PayloadFieldName = "added")]
    [Authorize]
    [UseUser]
    public async Task<bool> AddProductToWishlist(string productId, [GetUser] UserResult user) {
        await _productService.AddProductToWishlistAsync(user, productId);
        return true;
    }

    [UseMutationConvention(PayloadFieldName = "removed")]
    [Authorize]
    [UseUser]
    public async Task<bool> RemoveProductFromWishlist(string productId, [GetUser] UserResult user) {
        await _productService.RemoveProductFromWishlistAsync(user, productId);
        return true;
    }

    [Authorize]
    [UseUser]
    public async Task<CartProduct?> AddProductToCart(string productId, [GetUser] UserResult user) =>
        await _productService.AddProductToCartAsync(user, productId);

    [Authorize]
    [UseUser]
    public async Task<CartProduct?> RemoveProductFromCart(string productId, [GetUser] UserResult user) =>
        await _productService.RemoveProductFromCartAsync(user, productId);
}