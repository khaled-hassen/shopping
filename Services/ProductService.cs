using Backend.Exceptions;
using Backend.GraphQL.ProductResolver.Types;
using Backend.Interfaces;
using Backend.Models;
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

    public async Task AddProductAsync(ProductInput product, Store? store) {
        if (store is null) throw new InvalidInputException("User must have a store to add a product");

        var id = ObjectId.GenerateNewId();
        string coverImgUrl = await _fileUploadService.UploadFileAsync(product.CoverImage, "products", $"cover-{id.ToString()!}");
        var imagesUrls = new HashSet<string>();
        var index = 1;
        foreach (IFile image in product.Images) {
            string imgUrl = await _fileUploadService.UploadFileAsync(image, "products", $"iamge-{index++}-{id.ToString()!}");
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
                DiscountedPrice = product.DiscountedPrice,
                CategoryId = product.CategoryId,
                SubcategoryId = product.SubcategoryId,
                ProductType = product.ProductType,
                ShipmentPrice = product.ShipmentPrice
            }
        );
    }
}