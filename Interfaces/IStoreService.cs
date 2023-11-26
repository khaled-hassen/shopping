using Backend.GraphQL.ProductResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Models;

namespace Backend.Interfaces;

public interface IStoreService {
    Task<Store?> GetStoreAsync(UserResult user);
    Task<Store> CreateStoreAsync(UserResult user, string name, string description, IFile image);
    Task UpdateStoreAsync(UserResult user, string name, string description, IFile image);
    Task<StoreProductResult?> GetStoreProductAsync(string id, Store store);
    IExecutable<StoreProduct> GetStoreProductsAsync(Store store);
    Task AddProductAsync(ProductInput product, Store user);
    Task UpdateProductAsync(string id, ProductInput product, Store store);
    Task PublishProductAsync(string id, Store store);
    Task UnPublishProductAsync(string id, Store store);
    Task DeleteProductAsync(string id, Store store);
    Task<PublicStore?> GetPublicStoreAsync(string id);
}