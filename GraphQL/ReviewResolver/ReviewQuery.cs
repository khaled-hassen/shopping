using Backend.GraphQL.ReviewResolver.Types;
using Backend.Interfaces;

namespace Backend.GraphQL.ReviewResolver;

[ExtendObjectType<Query>]
public class ReviewQuery {
    private readonly IReviewService _reviewService;

    public ReviewQuery(IReviewService reviewService) => _reviewService = reviewService;

    [UseOffsetPaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<ProductReview> GetProductReviews(string productId) => _reviewService.GetProductReviewsAsync(productId);
}