using Backend.Attributes;
using Backend.GraphQL.ProductResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using Backend.Settings;
using HotChocolate.Authorization;

namespace Backend.GraphQL.StoreResolver;

[ExtendObjectType<Query>]
public class StoreQuery {
    private readonly IStoreService _storeService;

    public StoreQuery(IStoreService storeService) => _storeService = storeService;

    [Authorize]
    public decimal GetStoreFee() => AppConfig.StoreFee;

    [Authorize]
    [UseUser]
    public async Task<Store?> GetUserStore([GetUser] UserResult user) => await _storeService.GetStoreAsync(user);

    [Authorize]
    [UseUser]
    public async Task<StoreProductResult?> GetUserStoreProduct(string id, [GetUserStore] Store? store) {
        if (store is null) return null;
        return await _storeService.GetStoreProductAsync(id, store);
    }

    [Authorize]
    [UseUser]
    [UseOffsetPaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<StoreProduct> GetUserStoreProducts([GetUserStore] Store? store) {
        if (store is null) return null;
        return _storeService.GetStoreProductsAsync(store);
    }

    public async Task<PublicStore?> GetPublicStore(string id) => await _storeService.GetPublicStoreAsync(id);
}