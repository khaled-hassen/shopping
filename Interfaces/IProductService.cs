using Backend.GraphQL.ProductResolver.Types;
using Backend.Models;

namespace Backend.Interfaces;

public interface IProductService {
    Task AddProductAsync(ProductInput product, Store user);
    Task UpdateProductAsync(string id, ProductInput product, Store store);
    Task<Product?> GetStoreProductAsync(string id, Store store);
}