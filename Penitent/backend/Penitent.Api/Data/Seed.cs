using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
namespace Penitent.Api.Data;

public static class Seed
{
    public static async Task Run(IServiceProvider services, IConfiguration config)
    {
        using var scope = services.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<StoreDb>();
        await db.Database.MigrateAsync();
        if (!await db.Categories.AnyAsync())
        {
            var categories = new[] { new Category { Name = "T-shirts", Slug = "t-shirts" }, new Category { Name = "Hoodies", Slug = "hoodies" }, new Category { Name = "Trousers", Slug = "trousers" } };
            var sizes = new[] { "S", "M", "L", "XL" }.Select((s, i) => new Size { Name = s, SortOrder = i }).ToArray();
            var colours = new[] { new Colour { Name = "Ink", Hex = "#202020" }, new Colour { Name = "Bone", Hex = "#ded7cb" } };
            var collection = new Collection { Name = "Chapter 01 — Becoming", Slug = "becoming", Story = "For the versions of ourselves we have yet to meet. Everyday clothing, made with intention." };
            db.AddRange(categories); db.AddRange(sizes); db.AddRange(colours); db.Add(collection); await db.SaveChangesAsync();
            var names = new[] { "Quiet Hours Tee", "Afterimage Tee", "Essential Heavyweight Tee", "Still Life Tee", "Solitude Hoodie", "Becoming Hoodie", "Midnight Hoodie", "Unwritten Hoodie", "Everyday Wide Trouser", "Transit Cargo", "Soft Structure Trouser", "Nightfall Trouser" };
            var photos = new[] { "photo-1521572163474-6864f9cf17ab", "photo-1503341504253-dff4815485f1", "photo-1523398002811-999ca8dec234", "photo-1503342217505-b0a15ec3261c", "photo-1556821840-3a63f95609a7", "photo-1578681994506-b8f463449011", "photo-1556821840-3a63f95609a7", "photo-1578681994506-b8f463449011", "photo-1473966968600-fa801b869a1a", "photo-1624378439575-d8705ad7ae80", "photo-1473966968600-fa801b869a1a", "photo-1624378439575-d8705ad7ae80" };
            for (var i = 0; i < 12; i++)
            {
                var p = new Product
                {
                    Name = names[i],
                    Slug = names[i].ToLowerInvariant().Replace(" ", "-"),
                    CategoryId = categories[i / 4].Id,
                    Description = "A considered everyday silhouette. Understated details, generous proportions, and room to be yourself. Part of Chapter 01: Becoming.",
                    Material = i < 8 ? "100% cotton. Substantial hand feel." : "Cotton twill. Relaxed, structured drape.",
                    Care = "Cold wash inside out. Line dry. Do not bleach.",
                    PricePaise = (i < 4 ? 2400 + i * 200 : i < 8 ? 5800 + (i - 4) * 300 : 4200 + (i - 8) * 300) * 100L,
                    Published = true,
                    Images = [new ProductImage { Url = $"https://images.unsplash.com/{photos[i]}?auto=format&fit=crop&w=1000&q=85", Alt = names[i] + " — illustrative clothing photograph", SortOrder = 0 }],
                    Collections = [new ProductCollection { CollectionId = collection.Id }]
                };
                foreach (var colour in colours) foreach (var size in sizes) p.Variants.Add(new ProductVariant { Sku = $"PN-{i + 1:D2}-{colour.Name}-{size.Name}", SizeId = size.Id, ColourId = colour.Id, Inventory = new Inventory { Quantity = i == 0 && size.Name == "XL" ? 0 : 8 + (i % 5), Version = 1 } });
                db.Products.Add(p);
            }
            await db.SaveChangesAsync();
        }
        var email = config["Admin:Email"]; var password = config["Admin:Password"];
        if (!string.IsNullOrWhiteSpace(email) && !string.IsNullOrWhiteSpace(password))
        {
            var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            if (!await roles.RoleExistsAsync("Admin")) await roles.CreateAsync(new IdentityRole("Admin"));
            var users = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var user = await users.FindByEmailAsync(email);
            if (user == null) { user = new IdentityUser { UserName = email, Email = email, EmailConfirmed = true }; var result = await users.CreateAsync(user, password); if (!result.Succeeded) throw new InvalidOperationException(string.Join("; ", result.Errors.Select(e => e.Description))); }
            if (!await users.IsInRoleAsync(user, "Admin")) await users.AddToRoleAsync(user, "Admin");
        }
    }
}

