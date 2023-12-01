using Backend.Attributes;
using Backend.Exceptions;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using HotChocolate.Authorization;

namespace Backend.GraphQL.PaymentResolver;

[ExtendObjectType<Mutation>]
public class PaymentMutation {
    private readonly IPaymentService _paymentService;

    public PaymentMutation(IPaymentService paymentService) => _paymentService = paymentService;

    [Authorize]
    [UseUser]
    [UseMutationConvention(PayloadFieldName = "redirectUrl")]
    [Error<EmptyCartException>]
    [Error<EmptyBillingDetailsException>]
    public async Task<string> Checkout([GetUser] UserResult user) {
        if (user.BillingDetails is null) throw new EmptyBillingDetailsException();
        if (user.Cart is null || user.Cart.Items.Count == 0) throw new EmptyCartException();
        return await _paymentService.CheckoutAsync(user);
    }
}