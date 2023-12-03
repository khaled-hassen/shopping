using Backend.GraphQL.ReviewResolver.Types;
using Backend.GraphQL.UserResolver.Types;

namespace Backend.Interfaces;

public interface IReviewService {
    IExecutable<ProductReview> GetProductReviewsAsync(string productId);
    Task<ProductReview> AddNewReviewAsync(string productId, NewReview review, UserResult user);
    Task<ProductReview?> GetUserProductReviewAsync(string productId, UserResult? user);
    Task UpdateReviewAsync(string reviewId, NewReview review, UserResult user);
}