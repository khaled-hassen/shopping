using Backend.Attributes;
using Backend.GraphQL.ProductResolver.Types;
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
    [UseOffsetPaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<StoreProduct> GetStoreProducts([GetUserStore] Store? store) {
        if (store is null) return new List<StoreProduct>().AsExecutable();
        return _productService.GetStoreProductsAsync(store);
    }
}