namespace Backend.Settings;

public static class AppConfig {
    public static string JwtKey { get; private set; } = null!;
    public static string JwtIssuer { get; private set; } = null!;
    public static List<string> JwtAudience { get; private set; } = null!;
    public static string WebClient { get; private set; } = null!;
    public static string NoReplySenderEmail { get; private set; } = null!;

    public static void Configure(IConfiguration config) {
        var jwtSection = config.GetSection("Jwt");
        JwtKey = jwtSection.GetSection("Key").Value ?? "";
        JwtIssuer = jwtSection.GetSection("Issuer").Value ?? "";
        WebClient = jwtSection.GetSection("WebClient").Value ?? "";
        JwtAudience = new List<string> {
            jwtSection.GetSection("AdminPanel").Value ?? "",
            WebClient
        };
        NoReplySenderEmail = config.GetSection("MailConfig:NoReplaySender").Value ?? "";
    }
}