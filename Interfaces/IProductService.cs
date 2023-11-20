using Backend.GraphQL.ProductResolver.Types;
using Backend.Models;

namespace Backend.Interfaces;

public interface IProductService {
    Task AddProductAsync(ProductInput product, Store? user);
}