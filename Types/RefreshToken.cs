namespace Backend.Types;

public class RefreshToken {
    public string Value { get; set; } = null!;
    public DateTime ExpireDate { get; set; }
}