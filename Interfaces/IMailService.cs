namespace Backend.Interfaces;

public interface IMailService {
    public Task SendMailAsync(string to, string subject, string body);
}