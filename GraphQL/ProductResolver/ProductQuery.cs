using Backend.Attributes;
using Backend.Interfaces;
using Backend.Models;
using HotChocolate.Authorization;

namespace Backend.GraphQL.ProductResolver;

[ExtendObjectType<Query>]
public class ProductQuery {
    private readonly IProductService _productService;

    public ProductQuery(IProductService productService) => _productService = productService;

    [Authorize]
    [UseUser]
    public async Task<Product?> GetStoreProduct(string id, [GetUserStore] Store? store) {
        if (store is null) return null;
        return await _productService.GetStoreProductAsync(id, store);
    }
}