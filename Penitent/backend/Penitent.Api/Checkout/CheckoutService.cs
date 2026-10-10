using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Penitent.Api.Cart;
namespace Penitent.Api.Checkout;

public record Address(string Name, string Line1, string City, string State, string PostalCode, string Country);
public record CheckoutRequest(string Email, string Phone, Address Delivery, bool BillingSameAsDelivery, Address? Billing, string Packaging, string? GiftMessage);
public record CheckoutPreview(string Message, CartDto Cart, long DeliveryPaise, long PackagingPaise, long TotalPaise, string Packaging, string? GiftMessage);
public class CheckoutService(CartService carts)
{
    public async Task<CheckoutPreview> Preview(Guid id, CheckoutRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !new EmailAddressAttribute().IsValid(request.Email) || request.Email.Length > 254) throw new DemoException("Enter a valid email address.");
        if (!Regex.IsMatch(request.Phone ?? "", @"^(\+91[ -]?)?[6-9]\d{9}$")) throw new DemoException("Enter a valid Indian mobile number.");
        Validate(request.Delivery);
        if (!request.BillingSameAsDelivery) Validate(request.Billing);
        if (request.Packaging is not ("standard" or "gift")) throw new DemoException("Choose standard or gift packaging.");
        if (request.GiftMessage?.Length > 250) throw new DemoException("Gift message must be 250 characters or fewer.");
        var cart = await carts.Read(id);
        if (!cart.CanCheckout) throw new DemoException("Your bag is empty or contains changes. Review it before checkout.", 409);
        return new("Demo preview only. No order has been placed, no payment taken, and no stock reserved.", cart, 0, 0, cart.SubtotalPaise, request.Packaging, request.GiftMessage);
    }
    static void Validate(Address? a)
    {
        if (a == null || new[] { a.Name, a.Line1, a.City, a.State }.Any(x => string.IsNullOrWhiteSpace(x) || x.Length > 160)) throw new DemoException("Complete all address fields (up to 160 characters each).");
        if (a.Country != "IN" || !Regex.IsMatch(a.PostalCode ?? "", @"^[1-9]\d{5}$")) throw new DemoException("Delivery is limited to India. Enter a six-digit PIN code.");
    }
}


