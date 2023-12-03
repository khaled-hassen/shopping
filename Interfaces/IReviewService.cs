using Backend.GraphQL.ReviewResolver.Types;

namespace Backend.Interfaces;

public interface IReviewService {
    IExecutable<ProductReview> GetProductReviewsAsync(string productId);
}