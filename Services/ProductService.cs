using System.Linq.Expressions;
using Backend.GraphQL.ProductResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using HotChocolate.Data;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class ProductService : IProductService {
    private readonly IMemoryCache _cache;
    private readonly IMongoCollection<Category> _categories;
    private readonly IMongoCollection<Product> _products;
    private readonly IMongoCollection<Store> _stores;
    private readonly IMongoCollection<Subcategory> _subcategories;


    public ProductService(DatabaseService db, IMemoryCache cache) {
        _cache = cache;
        _categories = db.GetCategoriesCollection();
        _products = db.GetProductsCollection();
        _stores = db.GetStoresCollection();
        _subcategories = db.GetSubcategoriesCollection();
    }

    public IExecutable<ProductResult> GetProductsAsync(string subcategorySlug) {
        ObjectId? id = _subcategories.Find(c => c.Slug == subcategorySlug).Project(c => c.Id).FirstOrDefault();
        if (id is null) return null;

        return _products
            .Aggregate()
            .Match(c => c.SubcategoryId.Equals(id))
            .Match(c => c.Published)
            .Lookup<Product, Store, ProductLookupResult>(
                _stores,
                p => p.SellerId,
                s => s.Id,
                p => p.Stores
            )
            .Project(CreateProductProjection())
            .AsExecutable();
    }

    public async Task<ProductResult?> GetProductAsync(string id, UserResult? user) {
        IAggregateFluent<Product>? productQuery = _products
            .Aggregate()
            .Match(c => c.Id.ToString() == id)
            .Match(c => c.Published);

        ObjectId categoryId = await productQuery.Project(c => c.CategoryId).FirstOrDefaultAsync();
        ObjectId subcategoryId = await productQuery.Project(c => c.SubcategoryId).FirstOrDefaultAsync();
        bool inWishlist = user?.WishlistIds?.Contains(ObjectId.Parse(id)) ?? false;

        return await productQuery.Lookup<Product, Store, ProductLookupResult>(
                _stores,
                p => p.SellerId,
                s => s.Id,
                p => p.Stores
            )
            .Project(
                CreateProductProjection(
                    id,
                    true,
                    includeCategory: true,
                    categoryId: categoryId,
                    includeSubcategory: true,
                    subcategoryId: subcategoryId,
                    inWishlist: inWishlist
                )
            )
            .FirstOrDefaultAsync();
    }

    public async Task<Dictionary<string, string>?> GetProductUnitsAsync(string id) {
        Product? product = await _products.Find(c => c.Id.ToString() == id).FirstOrDefaultAsync();
        if (product is null) return null;
        if (_cache.TryGetValue($"ProductUnits-{id}", out Dictionary<string, string>? units)) return units;

        Subcategory? subcategory = await _subcategories.Find(c => c.Id.Equals(product.SubcategoryId)).FirstOrDefaultAsync();
        if (subcategory is null) return null;

        IEnumerable<Filter> filters = subcategory.Filters.Where(f => f.ProductTypes.Contains(product.ProductType));
        units = new Dictionary<string, string>();
        foreach (Filter filter in filters) {
            if (filter.Type != FilterType.Number) continue;
            units.Add(filter.Name, filter.Unit);
        }

        _cache.Set($"product-units-{id}", units, TimeSpan.FromDays(30));
        return units;
    }

    public IExecutable<ProductResult> GetStoreAsync(string storeId) {
        ObjectId id = ObjectId.Parse(storeId);
        return _products
            .Aggregate()
            .Match(p => p.SellerId.Equals(id))
            .Lookup<Product, Store, ProductLookupResult>(
                _stores,
                p => p.SellerId,
                s => s.Id,
                p => p.Stores
            )
            .Project(CreateProductProjection())
            .AsExecutable();
    }

    public IExecutable<ProductResult> GetWishlistProductsAsync(UserResult user) {
        HashSet<ObjectId>? wishlistIds = user.WishlistIds;
        if (wishlistIds is null || wishlistIds.Count == 0) return null;

        return _products
            .Aggregate()
            .Match(c => wishlistIds.Contains(c.Id ?? ObjectId.Empty))
            .Match(c => c.Published)
            .Lookup<Product, Store, ProductLookupResult>(
                _stores,
                p => p.SellerId,
                s => s.Id,
                p => p.Stores
            )
            .Project(CreateProductProjection())
            .AsExecutable();
    }

    private Expression<Func<ProductLookupResult, ProductResult>> CreateProductProjection(
        string? productId = null,
        bool includeUnits = false,
        ObjectId? categoryId = null,
        bool includeCategory = false,
        ObjectId? subcategoryId = null,
        bool includeSubcategory = false,
        bool inWishlist = false
    ) {
        Dictionary<string, string>? units = includeUnits && productId is not null ? GetProductUnitsAsync(productId).Result : null;
        Category? category = null;
        Subcategory? subcategory = null;
        if (includeCategory && categoryId is not null) category = _categories.Find(c => c.Id.Equals(categoryId)).FirstOrDefault();
        if (includeSubcategory && subcategoryId is not null) subcategory = _subcategories.Find(c => c.Id.Equals(subcategoryId)).FirstOrDefault();

        return c => new ProductResult {
            Id = c.Id,
            SellerId = c.SellerId,
            Name = c.Name,
            BriefDescription = c.BriefDescription,
            CoverImage = c.CoverImage,
            Images = c.Images,
            Details = c.Details,
            Discount = c.Discount,
            Price = c.Price,
            CategoryId = c.CategoryId,
            SubcategoryId = c.SubcategoryId,
            ProductType = c.ProductType.ToLower(),
            ShipmentPrice = c.ShipmentPrice,
            ReviewsIds = c.ReviewsIds,
            AddedAt = c.AddedAt,
            Published = c.Published,
            Description = c.Description,
            Store = new PublicStore {
                Id = c.Stores.First().Id,
                Name = c.Stores.First().Name,
                Image = c.Stores.First().Image,
                Description = c.Stores.First().Description
            },
            Units = units,
            Category = category,
            Subcategory = subcategory,
            InWishlist = inWishlist
        };
    }
}