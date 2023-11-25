using Backend.GraphQL.ProductResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using HotChocolate.Data;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class ProductService : IProductService {
    private readonly IFileUploadService _fileUploadService;
    private readonly IMongoCollection<Product> _products;

    public ProductService(DatabaseService db, IFileUploadService fileUploadService) {
        _fileUploadService = fileUploadService;
        _products = db.GetProductsCollection();
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
                Description = product.Description,
                CoverImage = coverImgUrl,
                Images = imagesUrls,
                Details = product.Details,
                Discount = product.Discount,
                Price = product.Price,
                DiscountedPrice = product.Discount is null ? null : product.Discount * product.Price,
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
                Description = product.Description,
                CoverImage = coverImgUrl ?? oldProduct.CoverImage,
                Images = imagesUrls,
                Details = product.Details,
                Discount = product.Discount,
                Price = product.Price,
                DiscountedPrice = product.Discount is null ? null : product.Discount * product.Price,
                CategoryId = product.CategoryId,
                SubcategoryId = product.SubcategoryId,
                ProductType = product.ProductType.ToLower(),
                ShipmentPrice = product.ShipmentPrice,
                ReviewsIds = oldProduct.ReviewsIds,
                AddedAt = oldProduct.AddedAt,
                Published = false
            }
        );
    }

    public async Task<Product?> GetStoreProductAsync(string id, Store store) =>
        await _products.Find(
            c => c.Id.ToString() == id && c.SellerId.Equals(store.Id)
        ).FirstOrDefaultAsync();

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


    public IExecutable<Product> GetStoreProductsAsync(Store store) =>
        _products.Find(p => p.SellerId.Equals(store.Id)).AsExecutable();
}