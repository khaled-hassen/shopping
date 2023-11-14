using Backend.Interfaces;

namespace Backend.Services;

public class MailService : IMailService {
    public async Task SendMailAsync(string to, string subject, string body) {
        Console.WriteLine(body);
    }
}