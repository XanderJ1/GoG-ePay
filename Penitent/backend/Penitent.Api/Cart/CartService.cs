using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Penitent.Api.Data;
namespace Penitent.Api.Cart;

public class CartService(StoreDb db, IDataProtectionProvider protection, IWebHostEnvironment env)
{
    readonly IDataProtector protector = protection.CreateProtector("Penitent.GuestCart.v1");
    public async Task<Guid> Identify(HttpContext context)
    {
        if (context.Request.Cookies.TryGetValue("penitent-cart", out var token))
        {
            try { var id = Guid.Parse(protector.Unprotect(token)); if (await db.Carts.AnyAsync(c => c.Id == id)) return id; }
            catch (Exception ex) when (ex is System.Security.Cryptography.CryptographicException or FormatException) { }
        }
        var cart = new Data.Cart { Id = Guid.NewGuid() }; db.Carts.Add(cart); await db.SaveChangesAsync();
        context.Response.Cookies.Append("penitent-cart", protector.Protect(cart.Id.ToString()), new CookieOptions { HttpOnly = true, Secure = !env.IsDevelopment(), SameSite = SameSiteMode.Lax, Path = "/", MaxAge = TimeSpan.FromDays(30) });
        return cart.Id;
    }
    public async Task<CartDto> Read(Guid id)
    {
        var items = await db.CartItems.AsNoTracking().Where(i => i.CartId == id)
         .Include(i => i.Variant).ThenInclude(v => v.Product).ThenInclude(p => p.Images)
         .Include(i => i.Variant).ThenInclude(v => v.Inventory)
         .Include(i => i.Variant).ThenInclude(v => v.Size).Include(i => i.Variant).ThenInclude(v => v.Colour).ToListAsync();
        var lines = items.Select(i =>
        {
            var p = i.Variant.Product; var issues = new List<string>();
            if (!p.Published) issues.Add("This product is no longer available.");
            if (i.Quantity > i.Variant.Inventory.Quantity) issues.Add("Stock changed. Reduce the quantity or remove this item.");
            if (i.SeenPricePaise != p.PricePaise) issues.Add("Price changed. Confirm by updating the quantity.");
            return new CartLine(i.Variant.Id, p.Name, p.Slug, i.Variant.Size.Name, i.Variant.Colour.Name, p.Images.OrderBy(x => x.SortOrder).FirstOrDefault()?.Url ?? "/placeholder.svg", i.Quantity, p.PricePaise, checked(p.PricePaise * i.Quantity), i.Variant.Inventory.Quantity, issues.ToArray());
        }).ToArray();
        return new(lines, lines.Sum(i => i.LineTotalPaise), "INR", lines.Length > 0 && lines.All(i => i.Issues.Length == 0));
    }
    public async Task<CartDto> Change(Guid id, int variantId, int quantity, bool add = false)
    {
        if (quantity < 1 || quantity > 99) throw new DemoException("Quantity must be between 1 and 99.");
        await using var tx = await db.Database.BeginTransactionAsync();
        // Serialize writers for this cart across API instances.
        await db.Database.ExecuteSqlInterpolatedAsync($"SELECT 1 FROM \"Carts\" WHERE \"Id\"={id} FOR UPDATE");
        var variant = await db.Variants.Include(v => v.Product).Include(v => v.Inventory).SingleOrDefaultAsync(v => v.Id == variantId);
        if (variant == null || !variant.Product.Published) throw new DemoException("This variant is unavailable.", 404);
        var line = await db.CartItems.SingleOrDefaultAsync(i => i.CartId == id && i.ProductVariantId == variantId);
        var desired = add ? checked((line?.Quantity ?? 0) + quantity) : quantity;
        if (desired > 99 || desired > variant.Inventory.Quantity) throw new DemoException("Requested quantity exceeds available stock.", 409);
        if (line == null) db.CartItems.Add(new CartItem { CartId = id, ProductVariantId = variantId, Quantity = desired, SeenPricePaise = variant.Product.PricePaise });
        else { line.Quantity = desired; line.SeenPricePaise = variant.Product.PricePaise; }
        await db.SaveChangesAsync(); await tx.CommitAsync(); return await Read(id);
    }
    public async Task<CartDto> Remove(Guid id, int variantId)
    {
        await using var tx = await db.Database.BeginTransactionAsync();
        await db.Database.ExecuteSqlInterpolatedAsync($"SELECT 1 FROM \"Carts\" WHERE \"Id\"={id} FOR UPDATE");
        await db.CartItems.Where(i => i.CartId == id && i.ProductVariantId == variantId).ExecuteDeleteAsync();
        await tx.CommitAsync(); return await Read(id);
    }
}
public record CartLine(int VariantId, string Name, string Slug, string Size, string Colour, string Image, int Quantity, long UnitPricePaise, long LineTotalPaise, int Stock, string[] Issues);
public record CartDto(CartLine[] Items, long SubtotalPaise, string Currency, bool CanCheckout);
public record CartChange(int VariantId, int Quantity);

