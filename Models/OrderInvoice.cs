using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Stripe;

namespace Backend.Models;

public class OrderInvoice {
    public Invoice Invoice = null!;

    [BsonId]
    [GraphQLNonNullType]
    public ObjectId? Id { get; set; }
}