using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Settings;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Helpers;

public static class AuthHelpers {
    public static string CreateToken(DateTime expires, List<Claim>? claims = null) {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppConfig.JwtKey));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var audiences = new List<Claim>();
        AppConfig.JwtAudience.ForEach(
            aud =>
                audiences.Add(new Claim(JwtRegisteredClaimNames.Aud, aud))
        );

        var token = new JwtSecurityToken(
            AppConfig.JwtIssuer,
            null,
            audiences.Concat(claims ?? new List<Claim>()),
            expires: expires,
            signingCredentials: cred
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static ClaimsPrincipal? ValidateToken(string token) {
        var tokenHandler = new JwtSecurityTokenHandler();
        byte[] key = Encoding.ASCII.GetBytes(AppConfig.JwtKey);
        try {
            return tokenHandler.ValidateToken(
                token,
                new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = AppConfig.JwtIssuer,
                    ValidateAudience = true,
                    ValidAudiences = AppConfig.JwtAudience,
                    ValidateLifetime = true
                },
                out _
            );
        }
        catch (Exception) {
            return null;
        }
    }
}