using Backend.GraphQL.Types;
using Backend.Interfaces;
using Backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class ConfigService : IConfigService {
    private readonly IMongoCollection<Category> _categoryCollection;
    private readonly IMongoCollection<Config> _collection;

    public ConfigService(DatabaseService service) {
        _collection = service.GetConfigCollection();
        _categoryCollection = service.GetCategoryCollection();
    }

    public async Task<ConfigResult?> GetConfig() {
        var res = await _collection.Aggregate()
            .Lookup<Config, Category, ConfigLookupResult>(
                _categoryCollection,
                config => config.HomeHeroCategoryId,
                category => category.Id,
                configResult => configResult.HomeHeroCategories
            )
            .Lookup<ConfigLookupResult, Category, ConfigLookupResult>(
                _categoryCollection,
                config => config.HeroCategoryId,
                category => category.Id,
                configResult => configResult.HeroCategories
            )
            .FirstOrDefaultAsync();
        if (res is null) return null;
        return new ConfigResult {
            Id = res.Id,
            HomeHeroCategory = res.HeroCategories.First(),
            HeroCategory = res.HeroCategories.First(),
            HeroCategoryId = res.HeroCategoryId,
            HomeHeroCategoryId = res.HomeHeroCategoryId,
            HeroTitle = res.HeroTitle,
            HeroSubtitle = res.HeroSubtitle,
            HeroBgColor = res.HeroBgColor,
            HeroActionBgColor = res.HeroActionBgColor
        };
    }

    public async Task<bool> UpdateConfig(Config config) {
        config.Id = ObjectId.GenerateNewId();
        var result = await _collection.ReplaceOneAsync(
            _ => true,
            config,
            new ReplaceOptions {
                IsUpsert = true
            }
        );
        return result is not null && result.ModifiedCount > 1;
    }
}