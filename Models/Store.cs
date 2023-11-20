using Backend.Attributes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class StoreBalance {
    public int TotalSales { get; set; }
    public int Balance { get; set; }
}

public class Store {
    [BsonId]
    [GraphQLNonNullType]
    public ObjectId? Id { get; set; }

    [UniqueField]
    public ObjectId OwnerId { get; set; }

    public string Name { get; set; } = null!;
    public string Image { get; set; } = null!;
    public string Description { get; set; } = null!;
    public StoreBalance Balance { get; set; } = null!;
}