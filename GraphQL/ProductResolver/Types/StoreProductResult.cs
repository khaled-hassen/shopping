using Backend.Models;

namespace Backend.GraphQL.ProductResolver.Types;

public class StoreProductResult : Product {
    public StoreProductResult() { }

    public StoreProductResult(Product product) {
        Id = product.Id;
        SellerId = product.SellerId;
        Name = product.Name;
        BriefDescription = product.BriefDescription;
        CoverImage = product.CoverImage;
        Images = product.Images;
        Details = product.Details;
        Discount = product.Discount;
        Price = product.Price;
        CategoryId = product.CategoryId;
        SubcategoryId = product.SubcategoryId;
        ProductType = product.ProductType.ToLower();
        ShipmentPrice = product.ShipmentPrice;
        ReviewsIds = product.ReviewsIds;
        AddedAt = product.AddedAt;
        Published = product.Published;
    }

    public Dictionary<string, string>? Units { get; set; }
}