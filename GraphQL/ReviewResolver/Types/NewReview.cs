namespace Backend.GraphQL.ReviewResolver.Types;

public class NewReview {
    public string Title { get; set; } = null!;
    public byte Rating { get; set; }
    public string Comment { get; set; } = null!;
}