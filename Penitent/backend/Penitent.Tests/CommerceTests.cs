using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Penitent.Api.Data;
using Xunit;
[assembly: CollectionBehavior(DisableTestParallelization = true)]
namespace Penitent.Tests;

public class StoreFixture : WebApplicationFactory<Program>, IAsyncLifetime
{
    public string DatabaseName { get; } = "penitent_tests_" + Guid.NewGuid().ToString("N");
    string BaseConnection => Environment.GetEnvironmentVariable("TEST_POSTGRES") ?? "Host=localhost;Port=55432;Database=penitent;Username=penitent;Password=penitent-local-only";
    protected override void ConfigureWebHost(IWebHostBuilder b) => b.UseEnvironment("Development");
    public async Task InitializeAsync()
    {
        await using var c = new NpgsqlConnection(BaseConnection); await c.OpenAsync();
        await using var command = new NpgsqlCommand($"CREATE DATABASE \"{DatabaseName}\"", c); await command.ExecuteNonQueryAsync();
        var connection = new NpgsqlConnectionStringBuilder(BaseConnection) { Database = DatabaseName };
        Environment.SetEnvironmentVariable("ConnectionStrings__Store", connection.ToString());
        Environment.SetEnvironmentVariable("Seed__Enabled", "true");
        Environment.SetEnvironmentVariable("Admin__Email", "test-admin@example.test");
        Environment.SetEnvironmentVariable("Admin__Password", "OnlyForTests!123");
        _ = CreateClient();
    }
    public new async Task DisposeAsync()
    {
        await base.DisposeAsync(); NpgsqlConnection.ClearAllPools();
        await using var c = new NpgsqlConnection(BaseConnection); await c.OpenAsync();
        await using var command = new NpgsqlCommand($"DROP DATABASE \"{DatabaseName}\" WITH (FORCE)", c); await command.ExecuteNonQueryAsync();
    }
    public HttpClient Guest() => CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true, AllowAutoRedirect = false });
    public async Task<string> Csrf(HttpClient c) { var json = await c.GetFromJsonAsync<JsonElement>("/api/v1/security/csrf"); return json.GetProperty("token").GetString()!; }
    public async Task<HttpResponseMessage> Send(HttpClient c, HttpMethod method, string path, object? body = null)
    {
        var request = new HttpRequestMessage(method, path); request.Headers.Add("X-CSRF-TOKEN", await Csrf(c)); if (body != null) request.Content = JsonContent.Create(body); return await c.SendAsync(request);
    }
    public async Task<int> Variant() { using var scope = Services.CreateScope(); return await scope.ServiceProvider.GetRequiredService<StoreDb>().Variants.Where(v => v.Inventory.Quantity >= 8).Select(v => v.Id).FirstAsync(); }
}
public class CommerceTests(StoreFixture f) : IClassFixture<StoreFixture>
{
    [Fact]
    public async Task CatalogueHasClothingAndSoldOutVariants()
    {
        using var c = f.Guest(); var page = await c.GetFromJsonAsync<JsonElement>("/api/v1/products"); Assert.Equal(12, page.GetProperty("total").GetInt32());
        Assert.Contains(page.GetProperty("items").EnumerateArray().SelectMany(p => p.GetProperty("variants").EnumerateArray()), v => v.GetProperty("stock").GetInt32() == 0);
        var invalid = await c.GetAsync("/api/v1/products?page=-1"); Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
    }
    [Fact]
    public async Task PricesAreServerOwnedAndRepeatedAddsMerge()
    {
        using var c = f.Guest(); var v = await f.Variant();
        var a = await f.Send(c, HttpMethod.Post, "/api/v1/cart/items", new { variantId = v, quantity = 2, pricePaise = 1 }); a.EnsureSuccessStatusCode();
        var b = await f.Send(c, HttpMethod.Post, "/api/v1/cart/items", new { variantId = v, quantity = 1 }); b.EnsureSuccessStatusCode();
        var cart = await b.Content.ReadFromJsonAsync<JsonElement>(); var lines = cart.GetProperty("items"); Assert.Equal(1, lines.GetArrayLength());
        var line = lines[0]; Assert.Equal(3, line.GetProperty("quantity").GetInt32()); Assert.Equal(line.GetProperty("unitPricePaise").GetInt64() * 3, cart.GetProperty("subtotalPaise").GetInt64()); Assert.True(cart.GetProperty("subtotalPaise").GetInt64() > 3);
        var update = await f.Send(c, HttpMethod.Put, $"/api/v1/cart/items/{v}", new { variantId = v, quantity = 2 }); update.EnsureSuccessStatusCode();
        Assert.Equal(2, (await update.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("items")[0].GetProperty("quantity").GetInt32());
        var delete = await f.Send(c, HttpMethod.Delete, $"/api/v1/cart/items/{v}"); delete.EnsureSuccessStatusCode();
        Assert.Equal(0, (await delete.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("subtotalPaise").GetInt64());
    }
    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(100)]
    public async Task InvalidQuantitiesAreRejected(int quantity) { using var c = f.Guest(); var r = await f.Send(c, HttpMethod.Post, "/api/v1/cart/items", new { variantId = await f.Variant(), quantity }); Assert.Equal(HttpStatusCode.BadRequest, r.StatusCode); }
    [Fact] public async Task StockCannotBeExceeded() { using var c = f.Guest(); var r = await f.Send(c, HttpMethod.Post, "/api/v1/cart/items", new { variantId = await f.Variant(), quantity = 99 }); Assert.Equal(HttpStatusCode.Conflict, r.StatusCode); }
    [Fact]
    public async Task CartIsolationAndTamperedCookies()
    {
        using var a = f.Guest(); var v = await f.Variant(); (await f.Send(a, HttpMethod.Post, "/api/v1/cart/items", new { variantId = v, quantity = 1 })).EnsureSuccessStatusCode();
        using var b = f.Guest(); var empty = await b.GetFromJsonAsync<JsonElement>("/api/v1/cart"); Assert.Equal(0, empty.GetProperty("items").GetArrayLength());
        using var forged = f.Guest(); forged.DefaultRequestHeaders.Add("Cookie", "penitent-cart=" + Guid.NewGuid());
        Assert.Equal(0, (await forged.GetFromJsonAsync<JsonElement>("/api/v1/cart")).GetProperty("items").GetArrayLength());
        Assert.Single((await a.GetFromJsonAsync<JsonElement>("/api/v1/cart")).GetProperty("items").EnumerateArray());
    }
    [Fact]
    public async Task CsrfAndAdminAccessAreEnforced()
    {
        using var c = f.Guest(); var unprotected = await c.PostAsJsonAsync("/api/v1/cart/items", new { variantId = 1, quantity = 1 }); Assert.Equal(HttpStatusCode.BadRequest, unprotected.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await c.GetAsync("/api/v1/admin/products")).StatusCode);
        var denied = await f.Send(c, HttpMethod.Post, "/api/v1/admin/products", new { }); Assert.Equal(HttpStatusCode.Unauthorized, denied.StatusCode);
    }
    [Fact]
    public async Task ConcurrentAddsAreSerialized()
    {
        using var c = f.Guest(); await c.GetAsync("/api/v1/cart"); var v = await f.Variant(); var token = await f.Csrf(c);
        var requests = Enumerable.Range(0, 6).Select(_ => { var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/cart/items") { Content = JsonContent.Create(new { variantId = v, quantity = 1 }) }; request.Headers.Add("X-CSRF-TOKEN", token); return c.SendAsync(request); });
        foreach (var r in await Task.WhenAll(requests)) r.EnsureSuccessStatusCode();
        Assert.Equal(6, (await c.GetFromJsonAsync<JsonElement>("/api/v1/cart")).GetProperty("items")[0].GetProperty("quantity").GetInt32());
    }
    static object Checkout(string pin = "560001", bool same = true, object? billing = null) => new { email = "guest@example.test", phone = "9876543210", delivery = new { name = "Demo Visitor", line1 = "12 Sample Street", city = "Bengaluru", state = "Karnataka", postalCode = pin, country = "IN" }, billingSameAsDelivery = same, billing, packaging = "gift", giftMessage = "A thoughtful demo." };
    [Fact]
    public async Task PreviewValidatesWithoutChangingInventory()
    {
        using var c = f.Guest(); var v = await f.Variant(); (await f.Send(c, HttpMethod.Post, "/api/v1/cart/items", new { variantId = v, quantity = 1 })).EnsureSuccessStatusCode();
        using var scope = f.Services.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<StoreDb>(); var before = await db.Inventory.AsNoTracking().SingleAsync(i => i.ProductVariantId == v);
        var valid = await f.Send(c, HttpMethod.Post, "/api/v1/checkout/preview", Checkout()); valid.EnsureSuccessStatusCode();
        Assert.Contains("No order", (await valid.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("message").GetString());
        Assert.Equal(HttpStatusCode.BadRequest, (await f.Send(c, HttpMethod.Post, "/api/v1/checkout/preview", Checkout("123"))).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await f.Send(c, HttpMethod.Post, "/api/v1/checkout/preview", Checkout(same: false))).StatusCode);
        var after = await db.Inventory.AsNoTracking().SingleAsync(i => i.ProductVariantId == v); Assert.Equal(before.Quantity, after.Quantity); Assert.Equal(before.Version, after.Version);
    }
    [Fact]
    public async Task PriceStockAndPublicationChangesAreVisible()
    {
        using var c = f.Guest(); var v = await f.Variant(); (await f.Send(c, HttpMethod.Post, "/api/v1/cart/items", new { variantId = v, quantity = 2 })).EnsureSuccessStatusCode();
        using var scope = f.Services.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<StoreDb>(); var variant = await db.Variants.Include(x => x.Product).Include(x => x.Inventory).SingleAsync(x => x.Id == v);
        var price = variant.Product.PricePaise; var stock = variant.Inventory.Quantity;
        try
        {
            variant.Product.PricePaise += 100; variant.Inventory.Quantity = 1; variant.Product.Published = false; await db.SaveChangesAsync();
            var cart = await c.GetFromJsonAsync<JsonElement>("/api/v1/cart"); Assert.Equal(3, cart.GetProperty("items")[0].GetProperty("issues").GetArrayLength()); Assert.False(cart.GetProperty("canCheckout").GetBoolean());
            Assert.Equal(HttpStatusCode.Conflict, (await f.Send(c, HttpMethod.Post, "/api/v1/checkout/preview", Checkout())).StatusCode);
        }
        finally { variant.Product.PricePaise = price; variant.Product.Published = true; variant.Inventory.Quantity = stock; await db.SaveChangesAsync(); }
    }
    [Fact]
    public async Task AdminRejectsDuplicateVariantsAndStaleInventory()
    {
        using var c = f.Guest(); (await f.Send(c, HttpMethod.Post, "/api/v1/admin/login", new { email = "test-admin@example.test", password = "OnlyForTests!123" })).EnsureSuccessStatusCode();
        using var scope = f.Services.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<StoreDb>(); var v = await db.Variants.Include(v => v.Inventory).FirstAsync();
        var duplicate = await f.Send(c, HttpMethod.Post, $"/api/v1/admin/products/{v.ProductId}/variants", new { sku = v.Sku, sizeId = v.SizeId, colourId = v.ColourId, stock = 1 }); Assert.Equal(HttpStatusCode.Conflict, duplicate.StatusCode);
        var negative = await f.Send(c, HttpMethod.Put, $"/api/v1/admin/products/{v.ProductId}/variants/{v.Id}", new { sku = v.Sku, sizeId = v.SizeId, colourId = v.ColourId, stock = -1, version = v.Inventory.Version }); Assert.Equal(HttpStatusCode.BadRequest, negative.StatusCode);
        var stale = await f.Send(c, HttpMethod.Put, $"/api/v1/admin/products/{v.ProductId}/variants/{v.Id}", new { sku = v.Sku, sizeId = v.SizeId, colourId = v.ColourId, stock = v.Inventory.Quantity, version = v.Inventory.Version - 1 }); Assert.Equal(HttpStatusCode.Conflict, stale.StatusCode);
    }
    [Fact]
    public async Task AdminCanCreateUpdateAndArchiveWithoutLosingCollections()
    {
        using var c = f.Guest(); (await f.Send(c, HttpMethod.Post, "/api/v1/admin/login", new { email = "test-admin@example.test", password = "OnlyForTests!123" })).EnsureSuccessStatusCode();
        var edit = new Penitent.Api.Admin.ProductEdit("Test Tee", "test-tee", "A test garment", "Cotton", "Cold wash", 123456, 1, true, [1], [new("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", "Test garment", null)]);
        var create = await f.Send(c, HttpMethod.Post, "/api/v1/admin/products", edit); create.EnsureSuccessStatusCode(); var id = (await create.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetInt32();
        (await f.Send(c, HttpMethod.Put, $"/api/v1/admin/products/{id}", edit with { Name = "Updated Tee" })).EnsureSuccessStatusCode();
        var page = await c.GetFromJsonAsync<JsonElement>("/api/v1/products/test-tee"); Assert.Single(page.GetProperty("collectionIds").EnumerateArray()); Assert.Equal(123456, page.GetProperty("pricePaise").GetInt64());
        Assert.Equal(HttpStatusCode.Conflict, (await f.Send(c, HttpMethod.Post, "/api/v1/admin/products", edit)).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await f.Send(c, HttpMethod.Post, $"/api/v1/admin/products/{id}/variants", new { sku = "TEST-INVALID", sizeId = 999, colourId = 1, stock = 1 })).StatusCode);
        var variant = await f.Send(c, HttpMethod.Post, $"/api/v1/admin/products/{id}/variants", new { sku = "TEST-TEE-S", sizeId = 1, colourId = 1, stock = 3 }); variant.EnsureSuccessStatusCode(); var v = (await variant.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetInt32();
        (await f.Send(c, HttpMethod.Put, $"/api/v1/admin/products/{id}", edit with { Published = false })).EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.NotFound, (await c.GetAsync("/api/v1/products/test-tee")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await f.Send(c, HttpMethod.Post, "/api/v1/cart/items", new { variantId = v, quantity = 1 })).StatusCode);
    }
    [Fact]
    public async Task ProductionApiRequiresTrustedProxyAndUsesSecureCookies()
    {
        using var app = f.WithWebHostBuilder(b => b.UseEnvironment("Production").UseSetting("Proxy:Key", "test-proxy-secret-at-least-32-characters"));
        using var c = app.CreateClient(new WebApplicationFactoryClientOptions { BaseAddress = new Uri("https://localhost"), HandleCookies = true });
        Assert.Equal(HttpStatusCode.OK, (await c.GetAsync("/health")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await c.GetAsync("/api/v1/products")).StatusCode);
        c.DefaultRequestHeaders.Add("X-Penitent-Proxy-Key", "test-proxy-secret-at-least-32-characters");
        var response = await c.GetAsync("/api/v1/cart"); response.EnsureSuccessStatusCode();
        Assert.Contains(response.Headers.GetValues("Set-Cookie"), cookie => cookie.Contains("secure", StringComparison.OrdinalIgnoreCase) && cookie.Contains("httponly", StringComparison.OrdinalIgnoreCase));
        var token = await f.Csrf(c); var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/cart/items") { Content = JsonContent.Create(new { variantId = await f.Variant(), quantity = 1 }) }; request.Headers.Add("X-CSRF-TOKEN", token); (await c.SendAsync(request)).EnsureSuccessStatusCode();
    }
}
