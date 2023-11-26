using MongoDB.Bson;

namespace Backend.GraphQL.ProductResolver.Types;

public class PublicStore {
    [GraphQLNonNullType]
    public ObjectId? Id { get; set; }

    public string Name { get; set; } = null!;
    public string Image { get; set; } = null!;
    public string Description { get; set; } = null!;
}