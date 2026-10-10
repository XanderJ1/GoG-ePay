using Microsoft.EntityFrameworkCore;
using Penitent.Api.Data;
namespace Penitent.Api.Admin;

public record ProductEdit(string Name, string Slug, string Description, string Material, string Care, long PricePaise, int CategoryId, bool Published, int[] CollectionIds, ImageEdit[] Images);
public record ImageEdit(string Url, string Alt, int? ColourId);
public record VariantEdit(string Sku, int SizeId, int ColourId, int Stock, long? Version);
public class AdminService(StoreDb db)
{
    public async Task<int> Save(int? id, ProductEdit edit)
    {
        if (new[] { edit.Name, edit.Slug, edit.Description, edit.Material, edit.Care }.Any(x => string.IsNullOrWhiteSpace(x) || x.Length > 4000) ||
          !System.Text.RegularExpressions.Regex.IsMatch(edit.Slug ?? "", "^[a-z0-9]+(?:-[a-z0-9]+)*$") || edit.PricePaise < 1 || edit.PricePaise > 100000000)
            throw new DemoException("Complete product details, use a lowercase slug, and enter a valid price.");
        if (edit.Images == null || edit.Images.Length < 1 || edit.Images.Length > 8 || edit.CollectionIds == null) throw new DemoException("Provide 1–8 images and collection identifiers.");
        if (!await db.Categories.AnyAsync(c => c.Id == edit.CategoryId)) throw new DemoException("Unknown category.");
        if (await db.Collections.CountAsync(c => edit.CollectionIds.Contains(c.Id)) != edit.CollectionIds.Distinct().Count()) throw new DemoException("Unknown collection.");
        foreach (var image in edit.Images)
        {
            if (!Uri.TryCreate(image.Url, UriKind.Absolute, out var url) || url.Scheme != "https" || string.IsNullOrWhiteSpace(image.Alt) || image.Alt.Length > 300) throw new DemoException("Images require HTTPS URLs and descriptive alt text.");
            if (image.ColourId.HasValue && !await db.Colours.AnyAsync(c => c.Id == image.ColourId)) throw new DemoException("Unknown image colour.");
        }
        if (await db.Products.AnyAsync(p => p.Slug == edit.Slug && p.Id != id)) throw new DemoException("Product slug already exists.", 409);
        var product = id.HasValue ? await db.Products.Include(p => p.Images).Include(p => p.Collections).SingleOrDefaultAsync(p => p.Id == id) : new Product();
        if (product == null) throw new DemoException("Product not found.", 404);
        product.Name = edit.Name; product.Slug = edit.Slug!; product.Description = edit.Description; product.Material = edit.Material; product.Care = edit.Care; product.PricePaise = edit.PricePaise; product.CategoryId = edit.CategoryId; product.Published = edit.Published;
        product.Images.Clear(); product.Images = edit.Images.Select((i, n) => new ProductImage { Url = i.Url, Alt = i.Alt, ColourId = i.ColourId, SortOrder = n }).ToList();
        product.Collections.RemoveAll(c => !edit.CollectionIds.Contains(c.CollectionId)); foreach (var collectionId in edit.CollectionIds.Distinct()) if (!product.Collections.Any(c => c.CollectionId == collectionId)) product.Collections.Add(new ProductCollection { CollectionId = collectionId });
        if (!id.HasValue) db.Products.Add(product);
        await db.SaveChangesAsync(); return product.Id;
    }
    public async Task<int> Variant(int productId, int? id, VariantEdit edit)
    {
        if (string.IsNullOrWhiteSpace(edit.Sku) || edit.Sku.Length > 80 || edit.Stock < 0 || edit.Stock > 100000) throw new DemoException("Use a valid SKU and stock from 0 to 100000.");
        if (!await db.Products.AnyAsync(p => p.Id == productId) || !await db.Sizes.AnyAsync(s => s.Id == edit.SizeId) || !await db.Colours.AnyAsync(c => c.Id == edit.ColourId)) throw new DemoException("Unknown product, size, or colour.");
        if (await db.Variants.AnyAsync(v => v.Id != id && (v.Sku == edit.Sku || (v.ProductId == productId && v.SizeId == edit.SizeId && v.ColourId == edit.ColourId)))) throw new DemoException("SKU or size/colour combination already exists.", 409);
        var variant = id.HasValue ? await db.Variants.Include(v => v.Inventory).SingleOrDefaultAsync(v => v.Id == id && v.ProductId == productId) : new ProductVariant { ProductId = productId, Inventory = new Inventory() };
        if (variant == null) throw new DemoException("Variant not found.", 404);
        if (id.HasValue && edit.Version != variant.Inventory.Version) throw new DemoException("Inventory changed. Reload before saving.", 409);
        variant.Sku = edit.Sku; variant.SizeId = edit.SizeId; variant.ColourId = edit.ColourId; variant.Inventory.Quantity = edit.Stock; variant.Inventory.Version++;
        if (!id.HasValue) db.Variants.Add(variant);
        await db.SaveChangesAsync(); return variant.Id;
    }
}


