using Backend.Interfaces;

namespace Backend.GraphQL.ReviewResolver;

[ExtendObjectType<Mutation>]
public class ReviewMutation {
    private readonly IReviewService _reviewService;

    public ReviewMutation(IReviewService reviewService) => _reviewService = reviewService;
}