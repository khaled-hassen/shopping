using MongoDB.Bson;

namespace Backend.GraphQL.ReviewResolver.Types;

public class ProductReview {
    public ObjectId Id { get; set; }
    public string ReviewerFullName { get; set; } = null!;
    public string Title { get; set; } = null!;
    public byte Rating { get; set; }
    public string Comment { get; set; } = null!;
    public DateTime PostDate { get; set; }
    public double AverageRating { get; set; }
    public long TotalRatings { get; set; }
}