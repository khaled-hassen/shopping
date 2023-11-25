using Backend.Attributes;
using Backend.Interfaces;
using Backend.Models;
using HotChocolate.Authorization;
using HotChocolate.Data;

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

    [Authorize]
    [UseUser]
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<Product> GetStoreProducts([GetUserStore] Store? store) {
        if (store is null) return new List<Product>().AsExecutable();
        return _productService.GetStoreProductsAsync(store);
    }
}