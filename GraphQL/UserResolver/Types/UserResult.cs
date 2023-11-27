using Backend.GraphQL.ProductResolver.Types;
using Backend.Models;
using Backend.Types;
using MongoDB.Bson;

namespace Backend.GraphQL.UserResolver.Types;

public class CartItem {
    public CartProduct Product { get; set; } = null!;
    public int Quantity { get; set; }
}

public class Cart {
    public HashSet<CartItem> Items { get; set; } = null!;
    public decimal Total { get; set; }
}

public class UserResult {
    public ObjectId Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public bool EmailVerified { get; set; }
    public BillingDetails? BillingDetails { get; set; } = null;
    public HashSet<ObjectId>? WishlistIds { get; set; } = null;
    public Dictionary<string, int>? CartItems { get; set; } = null;
    public Cart? Cart { get; set; } = null;
}

public class AuthUserResult : UserResult {
    public AccessToken AccessToken { get; set; } = null!;
}