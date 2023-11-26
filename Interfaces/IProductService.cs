using Backend.GraphQL.ProductResolver.Types;

namespace Backend.Interfaces;

public interface IProductService {
    IExecutable<ProductResult> GetProductsAsync(string subcategorySlug);
    Task<ProductResult?> GetProductAsync(string id);
    public Task<Dictionary<string, string>?> GetProductUnitsAsync(string id);
    IExecutable<ProductResult> GetStoreAsync(string storeId);
}