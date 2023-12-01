using Backend.GraphQL.UserResolver.Types;
using Stripe;

namespace Backend.Interfaces;

public interface IPaymentService {
    Task<string> CheckoutAsync(UserResult user);

    Task<string> GetStripeCustomerAsync(UserResult user);

    Task UpdateUserPurchasedProductsAsync(string userId, Invoice invoice);
}