using Backend.GraphQL.Types;
using Backend.Models;

namespace Backend.Interfaces;

public interface IConfigService {
    public Task<ConfigResult?> GetConfig();
    public Task<bool> UpdateConfig(Config config);
}