using Backend.Attributes;
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
    public async Task<Store?> GetStore([GetUser] UserResult user) => await _storeService.GetStoreAsync(user);
}