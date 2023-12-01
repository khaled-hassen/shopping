using Backend.Interfaces;
using Backend.Settings;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace Backend.Controllers;

[Route("webhook")]
[ApiController]
public class WebhookController : Controller {
    private readonly IProductService _productService;

    public WebhookController(IProductService productService) => _productService = productService;

    [HttpPost]
    public async Task<IActionResult> Index() {
        string json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try {
            Event? stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                AppConfig.StripeWebhookSecret
            );

            if (stripeEvent.Type == Events.InvoicePaymentSucceeded) {
                var invoice = (Invoice)stripeEvent.Data.Object;
                string? userId = invoice.Metadata.GetValueOrDefault("UserId");
                if (userId is null) return BadRequest();
                await _productService.UpdateUserPurchasedProductsAsync(userId, invoice);
            }

            return Ok();
        }
        catch (StripeException e) {
            return BadRequest();
        }
    }
}