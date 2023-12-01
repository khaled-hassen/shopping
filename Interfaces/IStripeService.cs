using Backend.GraphQL.UserResolver.Types;

namespace Backend.Interfaces;

public interface IStripeService {
    Task<string> CheckoutAsync(UserResult user);

    public Task<string> GetStripeCustomerAsync(UserResult user);
}