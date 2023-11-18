using System.Globalization;
using System.Security.Claims;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using Backend.Types;

namespace Backend.GraphQL.AdminResolver;

[ExtendObjectType<Query>]
public class AdminQuery {
    private readonly IAdminService _adminService;

    public AdminQuery(IAdminService adminService) => _adminService = adminService;

    public async Task<AccessToken> LoginAdmin(string email, string password) {
        Admin? admin = await _adminService.GetAdminAsync(email, password);
        if (admin is null) throw new GraphQLException(new Error("Wrong credentials", ErrorCodes.WrongCredentials));

        var claims = new List<Claim> {
            new(ClaimTypes.Role, "Admin")
        };
        DateTime expires = DateTime.Now.AddHours(1);
        string token = AuthHelpers.CreateToken(expires, claims);
        return new AccessToken(token, expires.ToString(CultureInfo.InvariantCulture));
    }
}