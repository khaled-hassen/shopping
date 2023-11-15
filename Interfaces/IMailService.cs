namespace Backend.Interfaces;

public interface IMailService {
    public Task SendMailAsync(string toEmail, string toName, string subject, string body);
    public string GenerateEmailVerification(string userId, string email, string firstname);
}