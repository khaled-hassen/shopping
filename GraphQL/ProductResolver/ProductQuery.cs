using Backend.GraphQL.ProductResolver.Types;
using Backend.Interfaces;

namespace Backend.GraphQL.ProductResolver;

[ExtendObjectType<Query>]
public class ProductQuery {
    private readonly IProductService _productService;

    public ProductQuery(IProductService productService) => _productService = productService;

    [UseOffsetPaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<ProductResult> GetProducts(string subcategorySlug) => _productService.GetProductsAsync(subcategorySlug);

    public async Task<ProductResult?> GetProduct(string id) => await _productService.GetProductAsync(id);

    [UseOffsetPaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<ProductResult> GetStoreProducts(string storeId) => _productService.GetStoreAsync(storeId);
}