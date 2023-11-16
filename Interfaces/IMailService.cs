namespace Backend.Interfaces;

public interface IMailService {
    public Task SendMailAsync(string toEmail, string toName, string subject, string body);
    public string GenerateEmailVerificationEmail(string userId, string email, string firstname);
    public string GeneratePasswordResetEmail(string userId, string email, string firstname);
}