using Backend.GraphQL.Types;
using Backend.Interfaces;

namespace Backend.GraphQL;

public class Query {
    private readonly IConfigService _service;

    public Query(IConfigService service) {
        _service = service;
    }

    public async Task<ConfigResult?> GetConfig() {
        return await _service.GetConfigAsync();
    }
}