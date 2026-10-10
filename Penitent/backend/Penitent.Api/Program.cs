using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Penitent.Api;
using Penitent.Api.Data;
using Penitent.Api.Catalogue;
using Penitent.Api.Cart;
using Penitent.Api.Checkout;
using Penitent.Api.Admin;
var builder = WebApplication.CreateBuilder(args);
var connection = builder.Configuration.GetConnectionString("Store");
if (string.IsNullOrEmpty(connection) && builder.Configuration["DATABASE_URL"] is { } databaseUrl)
{
    var uri = new Uri(databaseUrl); var auth = uri.UserInfo.Split(':', 2);
    connection = new Npgsql.NpgsqlConnectionStringBuilder { Host = uri.Host, Port = uri.Port > 0 ? uri.Port : 5432, Database = uri.AbsolutePath.TrimStart('/'), Username = Uri.UnescapeDataString(auth[0]), Password = auth.Length > 1 ? Uri.UnescapeDataString(auth[1]) : "", SslMode = Npgsql.SslMode.Require }.ToString();
}
builder.Services.AddDbContext<StoreDb>(o => o.UseNpgsql(connection ?? throw new InvalidOperationException("ConnectionStrings__Store or DATABASE_URL is required.")));
builder.Services.ConfigureHttpJsonOptions(o => o.SerializerOptions.NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.Strict);
builder.Services.AddIdentity<IdentityUser, IdentityRole>(o => { o.Password.RequiredLength = 12; o.Lockout.MaxFailedAccessAttempts = 5; })
 .AddEntityFrameworkStores<StoreDb>().AddDefaultTokenProviders();
builder.Services.ConfigureApplicationCookie(o =>
{
    o.Cookie.Name = "penitent-admin"; o.Cookie.HttpOnly = true; o.Cookie.SameSite = SameSiteMode.Lax;
    o.Cookie.SecurePolicy = builder.Environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
    o.Events.OnRedirectToLogin = c => { c.Response.StatusCode = 401; return Task.CompletedTask; };
    o.Events.OnRedirectToAccessDenied = c => { c.Response.StatusCode = 403; return Task.CompletedTask; };
});
builder.Services.AddAuthorization(o => o.AddPolicy("Admin", p => p.RequireRole("Admin")));
builder.Services.AddAntiforgery(o => { o.HeaderName = "X-CSRF-TOKEN"; o.Cookie.Name = "penitent-csrf"; o.Cookie.SecurePolicy = builder.Environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always; });
var keys = builder.Configuration["DataProtection:Path"];
var dataProtection = builder.Services.AddDataProtection().SetApplicationName("Penitent");
if (!string.IsNullOrEmpty(keys)) dataProtection.PersistKeysToFileSystem(new DirectoryInfo(keys));
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = 429;
    o.AddPolicy("login", context => RateLimitPartition.GetFixedWindowLimiter(context.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
});
builder.Services.AddOpenApi(); builder.Services.AddProblemDetails();
builder.Services.AddScoped<CatalogueService>(); builder.Services.AddScoped<CartService>(); builder.Services.AddScoped<CheckoutService>(); builder.Services.AddScoped<AdminService>();
var app = builder.Build();
app.UseExceptionHandler();
if (!app.Environment.IsDevelopment())
{
    var proxyKey = builder.Configuration["Proxy:Key"] ?? throw new InvalidOperationException("Proxy__Key is required in production.");
    if (proxyKey.Length < 32) throw new InvalidOperationException("Proxy__Key must be at least 32 characters.");
    app.Use(async (ctx, next) =>
    {
        if (ctx.Request.Path == "/health") { await next(); return; }
        var supplied = ctx.Request.Headers["X-Penitent-Proxy-Key"].ToString();
        if (!System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(System.Text.Encoding.UTF8.GetBytes(supplied), System.Text.Encoding.UTF8.GetBytes(proxyKey))) { await Results.Problem(title: "Access denied.", statusCode: 403).ExecuteAsync(ctx); return; }
        ctx.Request.Scheme = "https"; await next();
    });
}
app.Use(async (ctx, next) =>
{
    try { await next(); }
    catch (DemoException e) { await Results.Problem(title: e.Message, statusCode: e.Status).ExecuteAsync(ctx); }
    catch (DbUpdateConcurrencyException) { await Results.Problem(title: "Data changed. Reload and try again.", statusCode: 409).ExecuteAsync(ctx); }
    catch (DbUpdateException e) when (e.InnerException is Npgsql.PostgresException p && p.SqlState is "23505" or "23503" or "23514") { await Results.Problem(title: "This update violates a catalogue or inventory constraint.", statusCode: 409).ExecuteAsync(ctx); }
});
app.UseRateLimiter(); app.UseAuthentication(); app.UseAuthorization();
app.Use(async (ctx, next) =>
{
    ctx.Response.Headers.CacheControl = "no-store";
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    if (ctx.Request.Method is "POST" or "PUT" or "PATCH" or "DELETE")
    {
        try { await ctx.RequestServices.GetRequiredService<IAntiforgery>().ValidateRequestAsync(ctx); }
        catch (AntiforgeryValidationException) { await Results.Problem(title: "Security token expired. Refresh and try again.", statusCode: 400).ExecuteAsync(ctx); return; }
    }
    await next();
});
app.MapOpenApi();
app.MapGet("/health", async (StoreDb db) => await db.Database.CanConnectAsync() ? Results.Ok(new { status = "healthy" }) : Results.StatusCode(503));
var api = app.MapGroup("/api/v1");
api.MapGet("/security/csrf", (HttpContext ctx, IAntiforgery antiforgery) => Results.Ok(new { token = antiforgery.GetAndStoreTokens(ctx).RequestToken }));
api.MapGet("/catalogue/options", async (StoreDb db) => new { categories = await db.Categories.AsNoTracking().ToListAsync(), collections = await db.Collections.AsNoTracking().ToListAsync(), sizes = await db.Sizes.AsNoTracking().OrderBy(s => s.SortOrder).ToListAsync(), colours = await db.Colours.AsNoTracking().ToListAsync() });
api.MapGet("/products", async (CatalogueService service, string? category, string? collection, string? size, string? colour, long? min, long? max, string? sort, int? page, int? pageSize) => await service.List(category, collection, size, colour, min, max, sort, page ?? 1, pageSize ?? 12));
api.MapGet("/products/{slug}", async (string slug, CatalogueService service) => await service.Full().SingleOrDefaultAsync(p => p.Slug == slug) is { } p ? Results.Ok(CatalogueService.Map(p)) : Results.NotFound());
api.MapGet("/cart", async (HttpContext ctx, CartService service) => await service.Read(await service.Identify(ctx)));
api.MapPost("/cart/items", async (CartChange input, HttpContext ctx, CartService service) => await service.Change(await service.Identify(ctx), input.VariantId, input.Quantity, true));
api.MapPut("/cart/items/{variantId:int}", async (int variantId, CartChange input, HttpContext ctx, CartService service) => await service.Change(await service.Identify(ctx), variantId, input.Quantity));
api.MapDelete("/cart/items/{variantId:int}", async (int variantId, HttpContext ctx, CartService service) => await service.Remove(await service.Identify(ctx), variantId));
api.MapPost("/checkout/preview", async (CheckoutRequest input, HttpContext ctx, CartService carts, CheckoutService checkout) => await checkout.Preview(await carts.Identify(ctx), input));
api.MapPost("/admin/login", async (Login input, SignInManager<IdentityUser> signIn, UserManager<IdentityUser> users) =>
{
    if (string.IsNullOrWhiteSpace(input.Email) || string.IsNullOrWhiteSpace(input.Password)) return Results.Problem(title: "Enter administrator credentials.", statusCode: 400);
    var user = await users.FindByEmailAsync(input.Email);
    if (user == null || !await users.IsInRoleAsync(user, "Admin")) return Results.Problem(title: "Invalid administrator credentials.", statusCode: 401);
    var result = await signIn.PasswordSignInAsync(user, input.Password, false, true);
    return result.Succeeded ? Results.Ok(new { authenticated = true }) : Results.Problem(title: "Invalid administrator credentials.", statusCode: 401);
}).RequireRateLimiting("login");
var admin = api.MapGroup("/admin").RequireAuthorization("Admin");
admin.MapGet("/session", () => new { authenticated = true });
admin.MapPost("/logout", async (SignInManager<IdentityUser> signIn) => { await signIn.SignOutAsync(); return Results.NoContent(); });
admin.MapGet("/products", async (CatalogueService s) => await s.List(null, null, null, null, null, null, null, 1, 48, true));
admin.MapPost("/products", async (ProductEdit input, AdminService s) => Results.Ok(new { id = await s.Save(null, input) }));
admin.MapPut("/products/{id:int}", async (int id, ProductEdit input, AdminService s) => Results.Ok(new { id = await s.Save(id, input) }));
admin.MapPost("/products/{id:int}/variants", async (int id, VariantEdit input, AdminService s) => Results.Ok(new { id = await s.Variant(id, null, input) }));
admin.MapPut("/products/{id:int}/variants/{variantId:int}", async (int id, int variantId, VariantEdit input, AdminService s) => Results.Ok(new { id = await s.Variant(id, variantId, input) }));
if (builder.Configuration.GetValue("Seed:Enabled", false)) await Seed.Run(app.Services, app.Configuration);
app.Run();
public record Login(string Email, string Password);
public partial class Program { }




