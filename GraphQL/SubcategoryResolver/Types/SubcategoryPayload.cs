namespace Backend.GraphQL.SubcategoryResolver.Types;

public record SubcategoryPayload {
    public string Name { get; set; } = null!;
    public HashSet<string>? ProductTypes { get; set; } = new();
    public Dictionary<string, HashSet<string>>? Filters { get; set; } = new();
}