using Backend.Models;

namespace Backend.GraphQL.ReviewResolver.Types;

public class ProductReviewLookup : Review {
    public List<User> Reviewers { get; set; } = null!;
}