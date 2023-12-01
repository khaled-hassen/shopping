using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using Backend.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using Stripe;
using Stripe.Checkout;

namespace Backend.Services;

public class PaymentService : IPaymentService {
    private readonly IMongoCollection<OrderInvoice> _invoices;
    private readonly IMongoCollection<User> _users;


    public PaymentService(DatabaseService db) {
        _users = db.GetUsersCollection();
        _invoices = db.GetInvoicesCollection();
    }

    public async Task<string> CheckoutAsync(UserResult user) {
        string successUrl = AppConfig.WebClient + "/payment/success";
        string cancelUrl = AppConfig.WebClient + "/payment/cancel";

        string customerId = await GetStripeCustomerAsync(user);
        var options = new SessionCreateOptions {
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            Mode = "payment",
            Currency = "eur",
            LineItems = new List<SessionLineItemOptions>(),
            PaymentMethodTypes = new List<string> { "card" },
            Customer = customerId,
            InvoiceCreation = new SessionInvoiceCreationOptions {
                Enabled = true,
                InvoiceData = new SessionInvoiceCreationInvoiceDataOptions {
                    Metadata = new Dictionary<string, string> { { "UserId", user.Id.ToString()! } }
                }
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
                                Images = new List<string> { item.Product.CoverImage },
                                Metadata = new Dictionary<string, string> {
                                    { "ProductId", item.Product.Id.ToString() }
                                }
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

    public async Task<string> GetStripeCustomerAsync(UserResult user) {
        var service = new CustomerService();

        Customer? customer;
        if (user.CustomerId is not null) {
            customer = await service.GetAsync(user.CustomerId);
            if (customer is not null) return customer.Id;
        }

        var options = new CustomerCreateOptions {
            Email = user.Email,
            Name = user.FirstName + " " + user.LastName,
            Metadata = new Dictionary<string, string> { { "UserId", user.Id.ToString()! } }
        };

        customer = await service.CreateAsync(options);
        user.CustomerId = customer.Id;

        await _users.UpdateOneAsync(
            c => c.Id.Equals(user.Id),
            Builders<User>.Update.Set(u => u.CustomerId, user.CustomerId)
        );

        return customer.Id;
    }

    public async Task UpdateUserPurchasedProductsAsync(string userId, Invoice invoice) {
        User? user = await _users.Find(c => c.Id.ToString() == userId).FirstOrDefaultAsync();
        if (user is null) return;

        Dictionary<string, int>? cart = user.CartItems;
        if (cart is null || cart.Count == 0) return;
        var id = ObjectId.GenerateNewId();

        await _invoices.InsertOneAsync(
            new OrderInvoice {
                Id = id,
                Invoice = invoice
            }
        );

        await _users.UpdateOneAsync(
            c => c.Id.Equals(user.Id),
            Builders<User>.Update.Set(c => c.CartItems, new Dictionary<string, int>())
                .AddToSet(c => c.OrdersInvoicesIds, id)
        );
    }
}