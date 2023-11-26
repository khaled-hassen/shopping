using Backend.GraphQL.Types;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class ConfigService : IConfigService {
    private readonly IMemoryCache _cache;
    private readonly IMongoCollection<Category> _categoryCollection;
    private readonly IMongoCollection<Config> _collection;

    public ConfigService(DatabaseService service, IMemoryCache cache) {
        _cache = cache;
        _collection = service.GetConfigCollection();
        _categoryCollection = service.GetCategoriesCollection();
    }

    public async Task<ConfigResult?> GetConfigAsync() {
        if (_cache.TryGetValue("config", out ConfigResult? config)) return config;

        ConfigLookupResult? res = await _collection.Aggregate()
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
        config = new ConfigResult {
            Id = res.Id,
            HomeHeroCategory = res.HomeHeroCategories.First(),
            HeroCategory = res.HeroCategories.First(),
            HeroCategoryId = res.HeroCategoryId,
            HomeHeroCategoryId = res.HomeHeroCategoryId,
            HeroTitle = res.HeroTitle,
            HeroSubtitle = res.HeroSubtitle,
            HeroBgColor = res.HeroBgColor,
            HeroActionBgColor = res.HeroActionBgColor
        };
        _cache.Set("config", config, TimeSpan.FromDays(30));
        return config;
    }

    public async Task<bool> UpdateConfigAsync(Config config) {
        config.Id = ObjectId.GenerateNewId();
        ReplaceOneResult? result = await _collection.ReplaceOneAsync(
            _ => true,
            config,
            new ReplaceOptions {
                IsUpsert = true
            }
        );
        _cache.Remove("config");
        return result is not null && result.ModifiedCount > 1;
    }
}