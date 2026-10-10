using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
namespace Penitent.Api.Data;

public class StoreDb(DbContextOptions<StoreDb> options) : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<Product> Products => Set<Product>(); public DbSet<Category> Categories => Set<Category>();
    public DbSet<Collection> Collections => Set<Collection>(); public DbSet<Size> Sizes => Set<Size>();
    public DbSet<Colour> Colours => Set<Colour>(); public DbSet<ProductVariant> Variants => Set<ProductVariant>();
    public DbSet<Inventory> Inventory => Set<Inventory>(); public DbSet<Cart> Carts => Set<Cart>(); public DbSet<CartItem> CartItems => Set<CartItem>();
    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);
        b.Entity<Category>().HasIndex(x => x.Slug).IsUnique(); b.Entity<Collection>().HasIndex(x => x.Slug).IsUnique();
        b.Entity<Size>().HasIndex(x => x.Name).IsUnique(); b.Entity<Colour>().HasIndex(x => x.Name).IsUnique();
        b.Entity<Product>().HasIndex(x => x.Slug).IsUnique();
        b.Entity<Product>().ToTable(t => t.HasCheckConstraint("CK_Product_Price", "\"PricePaise\" > 0 AND \"PricePaise\" <= 100000000"));
        b.Entity<ProductCollection>().HasKey(x => new { x.ProductId, x.CollectionId });
        b.Entity<ProductVariant>().HasIndex(x => x.Sku).IsUnique();
        b.Entity<ProductVariant>().HasIndex(x => new { x.ProductId, x.SizeId, x.ColourId }).IsUnique();
        b.Entity<Inventory>().HasKey(x => x.ProductVariantId);
        b.Entity<Inventory>().HasOne(x => x.Variant).WithOne(x => x.Inventory).HasForeignKey<Inventory>(x => x.ProductVariantId);
        b.Entity<Inventory>().Property(x => x.Version).IsConcurrencyToken();
        b.Entity<Inventory>().ToTable(t => t.HasCheckConstraint("CK_Inventory_Quantity", "\"Quantity\" >= 0"));
        b.Entity<CartItem>().HasIndex(x => new { x.CartId, x.ProductVariantId }).IsUnique();
        b.Entity<CartItem>().HasOne(x => x.Variant).WithMany().OnDelete(DeleteBehavior.Restrict);
        b.Entity<CartItem>().ToTable(t => t.HasCheckConstraint("CK_CartItem_Quantity", "\"Quantity\" BETWEEN 1 AND 99"));
    }
}

