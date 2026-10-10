using Microsoft.AspNetCore.Identity;
namespace Penitent.Api.Data;

public class Category { public int Id { get; set; } public string Name { get; set; } = ""; public string Slug { get; set; } = ""; }
public class Collection { public int Id { get; set; } public string Name { get; set; } = ""; public string Slug { get; set; } = ""; public string Story { get; set; } = ""; }
public class Size { public int Id { get; set; } public string Name { get; set; } = ""; public int SortOrder { get; set; } }
public class Colour { public int Id { get; set; } public string Name { get; set; } = ""; public string Hex { get; set; } = ""; }
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = ""; public string Slug { get; set; } = "";
    public string Description { get; set; } = ""; public string Material { get; set; } = ""; public string Care { get; set; } = "";
    public long PricePaise { get; set; }
    public bool Published { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public List<ProductImage> Images { get; set; } = []; public List<ProductVariant> Variants { get; set; } = [];
    public List<ProductCollection> Collections { get; set; } = [];
}
public class ProductCollection { public int ProductId { get; set; } public Product Product { get; set; } = null!; public int CollectionId { get; set; } public Collection Collection { get; set; } = null!; }
public class ProductImage { public int Id { get; set; } public int ProductId { get; set; } public Product Product { get; set; } = null!; public string Url { get; set; } = ""; public string Alt { get; set; } = ""; public int SortOrder { get; set; } public int? ColourId { get; set; } public Colour? Colour { get; set; } }
public class ProductVariant
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string Sku { get; set; } = ""; public int SizeId { get; set; }
    public Size Size { get; set; } = null!;
    public int ColourId { get; set; }
    public Colour Colour { get; set; } = null!;
    public Inventory Inventory { get; set; } = null!;
}
public class Inventory { public int ProductVariantId { get; set; } public ProductVariant Variant { get; set; } = null!; public int Quantity { get; set; } public long Version { get; set; } }
public class Cart { public Guid Id { get; set; } public DateTime CreatedAt { get; set; } = DateTime.UtcNow; public List<CartItem> Items { get; set; } = []; }
public class CartItem { public int Id { get; set; } public Guid CartId { get; set; } public Cart Cart { get; set; } = null!; public int ProductVariantId { get; set; } public ProductVariant Variant { get; set; } = null!; public int Quantity { get; set; } public long SeenPricePaise { get; set; } }

