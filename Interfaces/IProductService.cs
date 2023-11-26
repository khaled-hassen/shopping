using Backend.GraphQL.ProductResolver.Types;
using Backend.GraphQL.UserResolver.Types;

namespace Backend.Interfaces;

public interface IProductService {
    IExecutable<ProductResult> GetProductsAsync(string subcategorySlug);
    Task<ProductResult?> GetProductAsync(string id, UserResult? user);
    public Task<Dictionary<string, string>?> GetProductUnitsAsync(string id);
    IExecutable<ProductResult> GetStoreAsync(string storeId);
    IExecutable<ProductResult> GetWishlistProductsAsync(UserResult user);
}