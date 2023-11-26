using Backend.GraphQL.ProductResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using Ganss.Xss;
using HotChocolate.Data;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class StoreService : IStoreService {
    private readonly IMemoryCache _cache;
    private readonly IMongoCollection<Category> _categories;
    private readonly IFileUploadService _fileUploadService;
    private readonly IMongoCollection<Product> _products;
    private readonly IProductService _productService;
    private readonly HtmlSanitizer _sanitizer;
    private readonly IMongoCollection<Store> _stores;

    public StoreService(
        DatabaseService db,
        IFileUploadService fileUploadService,
        IMemoryCache cache,
        HtmlSanitizer sanitizer,
        IProductService productService
    ) {
        _fileUploadService = fileUploadService;
        _cache = cache;
        _sanitizer = sanitizer;
        _stores = db.GetStoresCollection();
        _categories = db.GetCategoriesCollection();
        _products = db.GetProductsCollection();
        _productService = productService;
    }

    public async Task<Store?> GetStoreAsync(UserResult user) => await _stores.Find(c => c.OwnerId.Equals(user.Id)).FirstOrDefaultAsync();

    public async Task<Store> CreateStoreAsync(UserResult user, string name, string description, IFile image) {
        var id = ObjectId.GenerateNewId();
        string imagePath = await _fileUploadService.UploadFileAsync(image, "stores", id.ToString()!);

        var store = new Store {
            Id = ObjectId.GenerateNewId(),
            OwnerId = user.Id,
            Name = name,
            Description = description,
            Image = imagePath,
            Balance = new StoreBalance {
                Balance = 0,
                TotalSales = 0
            }
        };

        await _stores.InsertOneAsync(store);
        return store;
    }

    public async Task UpdateStoreAsync(UserResult user, string name, string description, IFile image) {
        Store? store = await _stores.Find(c => c.OwnerId.Equals(user.Id)).FirstOrDefaultAsync();
        if (store is null) return;

        _fileUploadService.DeleteFile(store.Image);
        string imagePath = await _fileUploadService.UploadFileAsync(image, "stores", store.Id.ToString()!);
        await _stores.UpdateOneAsync(
            c => c.Id.Equals(store.Id),
            Builders<Store>.Update.Set(c => c.Name, name)
                .Set(c => c.Description, description)
                .Set(c => c.Image, imagePath)
        );
    }

    public async Task AddProductAsync(ProductInput product, Store store) {
        var id = ObjectId.GenerateNewId();
        var folder = $"products/{id.ToString()}";
        string coverImgUrl = await _fileUploadService.UploadFileAsync(product.CoverImage.File!, folder, $"cover-{id.ToString()!}");
        var imagesUrls = new HashSet<string>();
        var index = 1;
        foreach (ProductImage image in product.Images) {
            if (image.File is null) continue;
            string imgUrl = await _fileUploadService.UploadFileAsync(image.File, folder, $"image-{index++}-{id.ToString()!}");
            imagesUrls.Add(imgUrl);
        }

        await _products.InsertOneAsync(
            new Product {
                Id = id,
                SellerId = store.Id ?? ObjectId.Empty,
                Name = product.Name,
                BriefDescription = product.BriefDescription,
                Description = _sanitizer.Sanitize(product.Description),
                CoverImage = coverImgUrl,
                Images = imagesUrls,
                Details = product.Details,
                Discount = product.Discount,
                Price = product.Price,
                CategoryId = product.CategoryId,
                SubcategoryId = product.SubcategoryId,
                ProductType = product.ProductType.ToLower(),
                ShipmentPrice = product.ShipmentPrice
            }
        );
    }

    public async Task UpdateProductAsync(string id, ProductInput product, Store store) {
        Product? oldProduct = await _products.Find(p => p.Id.ToString() == id && p.SellerId.Equals(store.Id)).FirstOrDefaultAsync();
        if (oldProduct is null) return;

        var folder = $"products/{id}";
        string? coverImgUrl = null;
        if (product.CoverImage.File is not null && product.CoverImage.NewImage) {
            _fileUploadService.DeleteFile(oldProduct.CoverImage);
            coverImgUrl = await _fileUploadService.UploadFileAsync(product.CoverImage.File, folder, $"cover-{id}");
        }

        var imagesUrls = new HashSet<string>();
        var index = 1;
        foreach (ProductImage image in product.Images) {
            if (image.File is null) continue;
            if (!image.NewImage) {
                imagesUrls.Add(oldProduct.Images.ElementAt(index - 1));
                index++;
                continue;
            }

            if (image.File is null) continue;
            _fileUploadService.DeleteFile(oldProduct.Images.ElementAt(index - 1));
            string imgUrl = await _fileUploadService.UploadFileAsync(image.File, folder, $"image-{index++}-{id}");
            imagesUrls.Add(imgUrl);
        }

        await _products.ReplaceOneAsync(
            p => p.Id.ToString() == id,
            new Product {
                Id = ObjectId.Parse(id),
                SellerId = store.Id ?? ObjectId.Empty,
                Name = product.Name,
                BriefDescription = product.BriefDescription,
                Description = _sanitizer.Sanitize(product.Description),
                CoverImage = coverImgUrl ?? oldProduct.CoverImage,
                Images = imagesUrls,
                Details = product.Details,
                Discount = product.Discount,
                Price = product.Price,
                CategoryId = product.CategoryId,
                SubcategoryId = product.SubcategoryId,
                ProductType = product.ProductType.ToLower(),
                ShipmentPrice = product.ShipmentPrice,
                ReviewsIds = oldProduct.ReviewsIds,
                AddedAt = oldProduct.AddedAt,
                Published = false
            }
        );
        _cache.Remove($"product-units-{id}");
    }

    public async Task<StoreProductResult?> GetStoreProductAsync(string id, Store store) {
        Product? product = await _products.Find(
            c => c.Id.ToString() == id && c.SellerId.Equals(store.Id)
        ).FirstOrDefaultAsync();
        if (product is null) return null;

        return new StoreProductResult(product) {
            Description = _sanitizer.Sanitize(product.Description),
            Units = await _productService.GetProductUnitsAsync(id)
        };
    }

    public async Task PublishProductAsync(string id, Store store) {
        Product? product = await GetStoreProductAsync(id, store);
        if (product is null) throw new GraphQLException(new Error("Product not found", ErrorCodes.NotFound));
        await _products.UpdateOneAsync(
            p => p.Id.ToString() == id && p.SellerId.Equals(store.Id),
            Builders<Product>.Update.Set(p => p.Published, true)
        );
    }

    public async Task UnPublishProductAsync(string id, Store store) {
        Product? product = await GetStoreProductAsync(id, store);
        if (product is null) throw new GraphQLException(new Error("Product not found", ErrorCodes.NotFound));
        await _products.UpdateOneAsync(
            p => p.Id.ToString() == id && p.SellerId.Equals(store.Id),
            Builders<Product>.Update.Set(p => p.Published, false)
        );
    }

    public async Task DeleteProductAsync(string id, Store store) {
        Product? product = await GetStoreProductAsync(id, store);
        if (product is null) throw new GraphQLException(new Error("Product not found", ErrorCodes.NotFound));
        await _products.DeleteOneAsync(
            p => p.Id.ToString() == id && p.SellerId.Equals(store.Id)
        );
    }

    public IExecutable<StoreProduct> GetStoreProductsAsync(Store store) =>
        _products
            .Aggregate()
            .Match(p => p.SellerId.Equals(store.Id))
            .Lookup<Product, Category, StoreProduct>(
                _categories,
                p => p.CategoryId,
                c => c.Id,
                p => p.Categories
            )
            .AsExecutable();

    public async Task<PublicStore?> GetPublicStoreAsync(string id) =>
        await _stores.Find(c => c.Id.ToString() == id)
            .Project(
                c => new PublicStore {
                    Id = c.Id,
                    Name = c.Name,
                    Image = c.Image,
                    Description = c.Description
                }
            )
            .FirstOrDefaultAsync();
}