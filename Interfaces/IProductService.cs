using Backend.GraphQL.ProductResolver.Types;
using Backend.GraphQL.UserResolver.Types;

namespace Backend.Interfaces;

public interface IProductService {
    IExecutable<ProductResult> GetProductsAsync(string subcategorySlug);
    Task<ProductResult?> GetProductAsync(string id, UserResult? user);
    Task<Dictionary<string, string>?> GetProductUnitsAsync(string id);
    IExecutable<ProductResult> GetStoreAsync(string storeId);
    IExecutable<ProductResult> GetWishlistProductsAsync(UserResult user);
    Task AddProductToWishlistAsync(UserResult user, string productId);
    Task RemoveProductFromWishlistAsync(UserResult user, string productId);
    Task<CartProduct?> AddProductToCartAsync(UserResult user, string productId);
    Task<CartProduct?> RemoveProductFromCartAsync(UserResult user, string productId);
}