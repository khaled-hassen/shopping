using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class Config {
    [BsonId]
    public ObjectId? Id { get; set; }

    public ObjectId HomeHeroCategoryId { get; set; }
    public ObjectId HeroCategoryId { get; set; }
    public string HeroTitle { get; set; } = string.Empty;
    public string HeroSubtitle { get; set; } = string.Empty;
    public string HeroBgColor { get; set; } = string.Empty;
    public string HeroActionBgColor { get; set; } = string.Empty;
}