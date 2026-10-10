using Microsoft.EntityFrameworkCore;
using Penitent.Api.Data;
namespace Penitent.Api.Catalogue;

public class CatalogueService(StoreDb db)
{
    public IQueryable<Product> Full(bool admin = false) => db.Products.AsNoTracking()
     .Include(p => p.Category).Include(p => p.Images).Include(p => p.Collections).ThenInclude(c => c.Collection)
     .Include(p => p.Variants).ThenInclude(v => v.Size)
     .Include(p => p.Variants).ThenInclude(v => v.Colour)
     .Include(p => p.Variants).ThenInclude(v => v.Inventory).Where(p => admin || p.Published).AsSplitQuery();
    public async Task<ProductPage> List(string? category, string? collection, string? size, string? colour, long? min, long? max, string? sort, int page = 1, int pageSize = 12, bool admin = false)
    {
        if (page < 1 || pageSize < 1 || pageSize > 48 || min < 0 || max < 0 || min > max) throw new DemoException("Invalid pagination or price range.");
        var q = Full(admin);
        if (!string.IsNullOrWhiteSpace(category)) q = q.Where(p => p.Category.Slug == category);
        if (!string.IsNullOrWhiteSpace(collection)) q = q.Where(p => p.Collections.Any(c => c.Collection.Slug == collection));
        if (!string.IsNullOrWhiteSpace(size) || !string.IsNullOrWhiteSpace(colour))
            q = q.Where(p => p.Variants.Any(v => (size == null || size == "" || v.Size.Name == size) && (colour == null || colour == "" || v.Colour.Name == colour) && v.Inventory.Quantity > 0));
        if (min.HasValue) q = q.Where(p => p.PricePaise >= min); if (max.HasValue) q = q.Where(p => p.PricePaise <= max);
        q = sort switch { "price-asc" => q.OrderBy(p => p.PricePaise).ThenBy(p => p.Id), "price-desc" => q.OrderByDescending(p => p.PricePaise).ThenBy(p => p.Id), "name" => q.OrderBy(p => p.Name).ThenBy(p => p.Id), _ => q.OrderBy(p => p.Id) };
        var count = await q.CountAsync(); var products = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new(products.Select(Map).ToArray(), count, page, pageSize);
    }
    public static ProductDto Map(Product p) => new(p.Id, p.Name, p.Slug, p.Description, p.Material, p.Care, p.PricePaise, p.Published, p.CategoryId, p.Category.Name, p.Category.Slug,
     p.Images.OrderBy(i => i.SortOrder).Select(i => new ImageDto(i.Url, i.Alt, i.ColourId)).ToArray(),
     p.Variants.OrderBy(v => v.Size.SortOrder).Select(v => new VariantDto(v.Id, v.Sku, v.SizeId, v.Size.Name, v.ColourId, v.Colour.Name, v.Colour.Hex, v.Inventory.Quantity, v.Inventory.Version)).ToArray(),
     p.Collections.Select(c => c.CollectionId).ToArray());
}
public record ProductPage(ProductDto[] Items, int Total, int Page, int PageSize);
public record ProductDto(int Id, string Name, string Slug, string Description, string Material, string Care, long PricePaise, bool Published, int CategoryId, string Category, string CategorySlug, ImageDto[] Images, VariantDto[] Variants, int[] CollectionIds);
public record ImageDto(string Url, string Alt, int? ColourId);
public record VariantDto(int Id, string Sku, int SizeId, string Size, int ColourId, string Colour, string Hex, int Stock, long Version);

