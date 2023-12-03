using Backend.Attributes;
using Backend.Exceptions;
using Backend.GraphQL.ReviewResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Validation;
using HotChocolate.Authorization;

namespace Backend.GraphQL.ReviewResolver;

[ExtendObjectType<Mutation>]
public class ReviewMutation {
    private readonly IReviewService _reviewService;

    public ReviewMutation(IReviewService reviewService) => _reviewService = reviewService;

    [Authorize]
    [UseUser]
    [Error<InvalidInputException>]
    public async Task<ProductReview> AddNewReviewAsync(string productId, NewReview review, [GetUser] UserResult user) {
        Validator<ReviewInputValidator, NewReview>.ValidateAndThrow(review);
        return await _reviewService.AddNewReviewAsync(productId, review, user);
    }

    [Authorize]
    [UseUser]
    [Error<InvalidInputException>]
    [UseMutationConvention(PayloadFieldName = "updated")]
    public async Task<bool> UpdateReview(string reviewId, NewReview review, [GetUser] UserResult user) {
        Validator<ReviewInputValidator, NewReview>.ValidateAndThrow(review);
        await _reviewService.UpdateReviewAsync(reviewId, review, user);
        return true;
    }
}