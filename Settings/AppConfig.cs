namespace Backend.Settings;

public static class AppConfig {
    public static string JwtKey { get; private set; } = null!;
    public static string JwtIssuer { get; private set; } = null!;
    public static List<string> JwtAudience { get; private set; } = null!;
    public static string WebClient { get; private set; } = null!;

    public static void Configure(IConfiguration config) {
        JwtKey = config.GetSection("Jwt:Key").Value ?? "";
        JwtIssuer = config.GetSection("Jwt:Issuer").Value ?? "";
        JwtAudience = new List<string> {
            config.GetSection("Jwt:AdminPanel").Value ?? "",
            config.GetSection("Jwt:WebClient").Value ?? ""
        };
        WebClient = config.GetSection("Jwt:WebClient").Value ?? "";
    }
}