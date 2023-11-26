using Backend.Attributes;
using Backend.GraphQL.ProductResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using HotChocolate.Authorization;

namespace Backend.GraphQL.ProductResolver;

[ExtendObjectType<Query>]
public class ProductQuery {
    private readonly IProductService _productService;

    public ProductQuery(IProductService productService) => _productService = productService;

    [UseOffsetPaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<ProductResult> GetProducts(string subcategorySlug) => _productService.GetProductsAsync(subcategorySlug);

    [UseUser]
    public async Task<ProductResult?> GetProduct(string id, [GetUser] UserResult? user) => await _productService.GetProductAsync(id, user);

    [UseOffsetPaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<ProductResult> GetStoreProducts(string storeId) => _productService.GetStoreAsync(storeId);


    [Authorize]
    [UseUser]
    [UseOffsetPaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<ProductResult> GetUserWishlistProducts([GetUser] UserResult user) => _productService.GetWishlistProductsAsync(user);
}