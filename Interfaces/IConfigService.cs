using Backend.GraphQL.Types;
using Backend.Models;

namespace Backend.Interfaces;

public interface IConfigService {
    public Task<ConfigResult?> GetConfigAsync();
    public Task<bool> UpdateConfigAsync(Config config);
}