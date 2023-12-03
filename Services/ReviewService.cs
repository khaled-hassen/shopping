using Backend.GraphQL.ReviewResolver.Types;
using Backend.GraphQL.UserResolver.Types;
using Backend.Interfaces;
using Backend.Models;
using HotChocolate.Data;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class ReviewService : IReviewService {
    private readonly IMongoCollection<Product> _products;
    private readonly IMongoCollection<Review> _reviews;
    private readonly IMongoCollection<User> _users;

    public ReviewService(DatabaseService db) {
        _reviews = db.GetReviewsCollection();
        _users = db.GetUsersCollection();
        _products = db.GetProductsCollection();
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
                    PostDate = p.PostDate
                }
            )
            .AsExecutable();
    }

    public async Task<ProductReview?> GetUserProductReviewAsync(string productId, UserResult user) =>
        await _reviews
            .Aggregate()
            .Match(c => c.ProductId.ToString() == productId && c.ReviewerId.Equals(user.Id))
            .Project(
                p => new ProductReview {
                    Id = p.Id ?? ObjectId.Empty,
                    ReviewerFullName = user.FirstName + " " + user.LastName,
                    Title = p.Title,
                    Rating = p.Rating,
                    Comment = p.Comment,
                    PostDate = p.PostDate
                }
            )
            .FirstOrDefaultAsync();

    public async Task<ProductReview> AddNewReviewAsync(string productId, NewReview review, UserResult user) {
        var newReview = new Review {
            Id = ObjectId.GenerateNewId(),
            ReviewerId = user.Id,
            ProductId = ObjectId.Parse(productId),
            Title = review.Title,
            Rating = review.Rating,
            Comment = review.Comment,
            PostDate = DateTime.Now
        };
        await _reviews.InsertOneAsync(newReview);
        await _products.UpdateOneAsync(
            c => c.Id.ToString() == productId,
            Builders<Product>.Update.AddToSet(c => c.ReviewsIds, newReview.Id ?? ObjectId.Empty)
        );
        await _users.UpdateOneAsync(c => c.Id.Equals(user.Id), Builders<User>.Update.AddToSet(c => c.ReviewsIds, newReview.Id ?? ObjectId.Empty));
        return new ProductReview {
            Id = newReview.Id ?? ObjectId.Empty,
            Title = newReview.Title,
            Rating = newReview.Rating,
            Comment = newReview.Comment,
            PostDate = newReview.PostDate,
            ReviewerFullName = user.FirstName + " " + user.LastName
        };
    }
}