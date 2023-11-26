using Backend.GraphQL.ProductResolver.Types;
using Backend.Models;

namespace Backend.Interfaces;

public interface IProductService {
    Task AddProductAsync(ProductInput product, Store user);
    Task UpdateProductAsync(string id, ProductInput product, Store store);
    Task<StoreProductResult?> GetStoreProductAsync(string id, Store store);
    Task PublishProductAsync(string id, Store store);
    Task UnPublishProductAsync(string id, Store store);
    Task DeleteProductAsync(string id, Store store);
    IExecutable<StoreProduct> GetStoreProductsAsync(Store store);
    IExecutable<ProductResult> GetProductsAsync(string subcategorySlug);
    Task<ProductResult?> GetProductAsync(string id);
}