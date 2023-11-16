﻿using System.Security.Claims;
using System.Text;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Settings;
using Fluid;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Model;
using Task = System.Threading.Tasks.Task;

namespace Backend.Services;

public class MailService : IMailService {
    private readonly TransactionalEmailsApi _emailsApi;
    private readonly FluidParser _parser;

    public MailService(TransactionalEmailsApi emailsApi, FluidParser parser) {
        _emailsApi = emailsApi;
        _parser = parser;
    }

    public async Task SendMailAsync(string toEmail, string toName, string subject, string body) {
        var senderName = "OneStopMALL";
        var senderEmail = AppConfig.NoReplySenderEmail;
        var sender = new SendSmtpEmailSender(senderName, senderEmail);
        List<SendSmtpEmailTo> receivers = new() { new SendSmtpEmailTo(toEmail, toName) };

        try {
            var sendSmtpEmail = new SendSmtpEmail(sender, receivers, null, null, body, null, subject);
            await _emailsApi.SendTransacEmailAsync(sendSmtpEmail);
        }
        catch (Exception e) {
            throw new GraphQLException(new Error(e.Message));
        }
    }

    public string GenerateEmailVerificationEmail(string userId, string email, string firstname) {
        var token = CreateUserToken(userId, email);
        var template = File.ReadAllText("Email/templates/email-verification.html");
        StringBuilder builder = new(AppConfig.WebClient);
        builder.Append($"/verify-email?token={token}");
        var verificationLink = builder.ToString();
        var model = new { Firstname = firstname, VerificationLink = verificationLink };
        return ParseEmailTemplate(template, model);
    }

    public string GeneratePasswordResetEmail(string userId, string email, string firstname) {
        var template = File.ReadAllText("Email/templates/password-reset.html");
        StringBuilder builder = new(AppConfig.WebClient);
        var token = CreateUserToken(userId, email);
        builder.Append($"/reset-password?token={token}");
        var resetLink = builder.ToString();
        var model = new { Firstname = firstname, ResetLink = resetLink };
        return ParseEmailTemplate(template, model);
    }

    private string CreateUserToken(string userId, string email) {
        var claims = new List<Claim> {
            new(ClaimTypes.Sid, userId),
            new(ClaimTypes.Email, email)
        };
        return AuthHelpers.CreateToken(DateTime.Now.AddMinutes(10), claims);
    }

    private string ParseEmailTemplate(string template, object model) {
        if (_parser.TryParse(template, out var body, out var error)) {
            var context = new TemplateContext(model);
            return body.Render(context);
        }

        throw new GraphQLException(error);
    }
}