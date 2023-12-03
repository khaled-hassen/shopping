using Backend.GraphQL.ReviewResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using HotChocolate.Data;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class ReviewService : IReviewService {
    private readonly IMongoCollection<Review> _reviews;
    private readonly IMongoCollection<User> _users;

    public ReviewService(DatabaseService db) {
        _reviews = db.GetReviewsCollection();
        _users = db.GetUsersCollection();
    }

    public IExecutable<ProductReview> GetProductReviewsAsync(string productId) {
        IAggregateFluent<Review>? reviewsQuery = _reviews
            .Aggregate()
            .Match(c => c.ProductId.ToString() == productId);

        var avgRating = reviewsQuery.Group(
            g => 0,
            g => new {
                AverageRating = g.Average(r => r.Rating),
                TotalRatings = g.Count()
            }
        ).FirstOrDefault();
        if (avgRating is null) return null;

        return reviewsQuery
            .Lookup<Review, User, ProductReviewLookup>(
                _users,
                c => c.ReviewerId,
                c => c.Id,
                c => c.Reviewers
            )
            .Project(
                p => new ProductReview {
                    Id = p.Id ?? ObjectId.Empty,
                    AverageRating = avgRating.AverageRating,
                    TotalRatings = avgRating.TotalRatings,
                    ReviewerFullName = p.Reviewers.First().FirstName + " " + p.Reviewers.First().LastName,
                    Title = p.Title,
                    Rating = p.Rating,
                    Comment = p.Comment,
                    PostDate = p.PostDate,
                }
            )
            .AsExecutable();
    }
}