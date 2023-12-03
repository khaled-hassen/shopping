using Backend.Attributes;
using Backend.GraphQL.ReviewResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;

namespace Backend.GraphQL.ReviewResolver;

[ExtendObjectType<Query>]
public class ReviewQuery {
    private readonly IReviewService _reviewService;

    public ReviewQuery(IReviewService reviewService) => _reviewService = reviewService;

    [UseOffsetPaging(IncludeTotalCount = true, DefaultPageSize = 15)]
    public IExecutable<ProductReview> GetProductReviews(string productId) => _reviewService.GetProductReviewsAsync(productId);

    [UseUser]
    public Task<ProductReview?> GetUserProductReview(string productId, [GetUser] UserResult? user) =>
        _reviewService.GetUserProductReviewAsync(productId, user);
}