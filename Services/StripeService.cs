using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Settings;
using Stripe.Checkout;

namespace Backend.Services;

public class StripeService : IStripeService {
    public async Task<string> CheckoutAsync(UserResult user) {
        string successUrl = AppConfig.WebClient + "/payment/success";
        string cancelUrl = AppConfig.WebClient + "/payment/cancel";

        var options = new SessionCreateOptions {
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            Mode = "payment",
            Currency = "eur",
            LineItems = new List<SessionLineItemOptions>(),
            PaymentMethodTypes = new List<string> { "card" },
            CustomerEmail = user.Email,
            InvoiceCreation = new SessionInvoiceCreationOptions {
                Enabled = true
            }
        };

        user.Cart?.Items.ToList().ForEach(
            item => {
                options.LineItems.Add(
                    new SessionLineItemOptions {
                        PriceData = new SessionLineItemPriceDataOptions {
                            UnitAmountDecimal = Convert.ToInt64(item.Product.Price * (1 - (item.Product.Discount ?? 0)) * 100), // convert to cents
                            Currency = "eur",
                            ProductData = new SessionLineItemPriceDataProductDataOptions {
                                Name = item.Product.Name,
                                Images = new List<string> { item.Product.CoverImage }
                            }
                        },
                        Quantity = item.Quantity
                    }
                );
            }
        );

        var service = new SessionService();
        Session? session = await service.CreateAsync(options);
        return session?.Url ?? "";
    }
}