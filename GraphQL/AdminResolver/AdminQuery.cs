using System.Globalization;
using System.Security.Claims;
using Backend.Helpers;
using Backend.Interfaces;

namespace Backend.GraphQL.AdminResolver;

[ExtendObjectType(typeof(Query))]
public class AdminQuery {
    private readonly IAdminService _adminService;

    public AdminQuery(IAdminService adminService) {
        _adminService = adminService;
    }

    public async Task<Token> LoginAdmin(string email, string password) {
        var admin = await _adminService.GetAdminAsync(email, password);
        if (admin is null) throw new GraphQLException(new Error("Wrong credentials", ErrorCodes.AdminNotFound));

        var claims = new List<Claim> {
            new(ClaimTypes.Role, "Admin")
        };
        var expires = DateTime.Now.AddHours(1);
        var token = AuthHelpers.CreateToken(expires, claims);
        return new Token(token, expires.ToString(CultureInfo.InvariantCulture));
    }
}