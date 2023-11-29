using System.Security.Claims;
using Backend.GraphQL.ProductResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Models;
using Backend.Services;
using HotChocolate.Resolvers;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Middleware;

public class UserMiddleware {
    public const string UserContextDataKey = "User";
    public const string UserStoreContextDataKey = "UserStore";
    private readonly FieldDelegate _next;
    private readonly IMongoCollection<Product> _products;
    private readonly IMongoCollection<Store> _stores;
    private readonly IMongoCollection<User> _users;

    public UserMiddleware(FieldDelegate next, DatabaseService db) {
        _next = next;
        _users = db.GetUsersCollection();
        _stores = db.GetStoresCollection();
        _products = db.GetProductsCollection();
    }

    public async Task Invoke(IMiddlewareContext context) {
        ClaimsPrincipal? claimsPrincipal = context.GetUser();
        if (claimsPrincipal is null) {
            await _next(context);
            return;
        }

        Claim? claim = claimsPrincipal.FindFirst(ClaimTypes.Sid);
        if (claim is null) {
            await _next(context);
            return;
        }

        string id = claim.Value;
        User? user = await _users.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
        if (user is null) {
            await _next(context);
            return;
        }

        // // load the cart products
        Dictionary<string, int> cartItems = user.CartItems ?? new Dictionary<string, int>();
        List<ObjectId?> cartItemIds = cartItems.Keys.Select(c => (ObjectId?)ObjectId.Parse(c)).ToList();
        var foundProducts = await _products
            .Find(Builders<Product>.Filter.In(c => c.Id, cartItemIds))
            .Project(
                c => new {
                    c.Id,
                    c.Name,
                    c.Price,
                    c.Discount,
                    c.CoverImage
                }
            )
            .ToListAsync();

        var products = new List<CartProduct>();
        foreach (var product in foundProducts)
            products.Add(
                new CartProduct {
                    Id = product.Id.ToString()!,
                    Name = product.Name,
                    Price = product.Price,
                    CoverImage = product.CoverImage,
                    Discount = product.Discount
                }
            );

        var cart = new Cart {
            Items = products.Select(c => new CartItem { Product = c, Quantity = cartItems[c.Id] }).ToHashSet(),
            Total = products.Sum(c => (c.Price - c.Price * (c.Discount ?? 0)) * cartItems[c.Id])
        };

        if (!context.ContextData.ContainsKey(UserContextDataKey))
            context.ContextData.Add(
                UserContextDataKey,
                new UserResult {
                    Id = user.Id ?? ObjectId.Empty,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    EmailVerified = user.EmailVerifiedAt is not null,
                    BillingDetails = user.BillingDetails,
                    WishlistIds = user.WishlistIds,
                    Cart = cart,
                    CartItems = user.CartItems
                }
            );

        Store? store = await _stores.Find(c => c.OwnerId.Equals(user.Id)).FirstOrDefaultAsync();
        if (store is not null && !context.ContextData.ContainsKey(UserStoreContextDataKey)) context.ContextData.Add(UserStoreContextDataKey, store);

        await _next(context);
    }
}