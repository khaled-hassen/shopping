using Backend.Models;

namespace Backend.GraphQL.Types;

public class ConfigLookupResult : Config {
    public List<Category> HomeHeroCategories { get; set; }
    public List<Category> HeroCategories { get; set; } = null!;
}

public class ConfigResult : Config {
    public Category HomeHeroCategory { get; set; } = null!;
    public Category HeroCategory { get; set; } = null!;
}