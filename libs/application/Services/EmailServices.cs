using HSMS.Application.Abstractions;
using HSMS.Application.IServices;
using HSMS.contracts.Dto;
using HSMS.shared.Helpers;
using MailKit.Security;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Application.Services
{
    public class EmailServices : IEmailServices
    {
        private readonly Confighelper _configs;
        private readonly EmailSettingDto _settingDto;
        public EmailServices(Confighelper config) 
        {
            _configs = config;
            _settingDto = config.EmailConfig();
        }
        public async Task<Result<string>> SendEmailAsync(EmailRequest dto)
        {
            try
            {
                var email = new MimeMessage();

                email.From.Add(new MailboxAddress("", _settingDto.SenderEmailfrom?.Trim() ?? ""));
                email.To.Add(new MailboxAddress( "", _settingDto.SenderToEmail ?? ""));
                email.Subject = $"This send by {dto.Name} & {dto.To}";
                
                
                var builder = new BodyBuilder { HtmlBody = dto.Body };
                email.Body = builder.ToMessageBody();

                // sanitize and validate settings
                var smtpServer = _settingDto.SmtpServer?.Trim();
                var port = _settingDto.Port;
                var senderEmail = _settingDto.SenderEmailfrom?.Trim();
                // Remove internal spaces from app password (Google displays app passwords with spaces)
                var senderPassword = (_settingDto.SenderPassword ?? "").Replace(" ", "");

                if (string.IsNullOrWhiteSpace(smtpServer) ||
                    string.IsNullOrWhiteSpace(senderEmail) ||
                    string.IsNullOrWhiteSpace(senderPassword) ||
                    port <= 0)
                {
                    return new Result<string>
                    {
                        ErrorMessage = "Email settings are invalid or missing. Check SmtpServer, Port, SenderEmail and SenderPassword."
                    };
                }

                using var smtp = new MailKit.Net.Smtp.SmtpClient();

                await smtp.ConnectAsync(smtpServer, port, SecureSocketOptions.StartTls);

                if (smtp.AuthenticationMechanisms.Contains("XOAUTH2"))
                    smtp.AuthenticationMechanisms.Remove("XOAUTH2");

                await smtp.AuthenticateAsync(senderEmail, senderPassword);

                await smtp.SendAsync(email);
                
                await smtp.DisconnectAsync(true);
                
                return new Result<string> { Data = "Email sent successfully." };

            }
            catch (Exception ex)
            {
                return new Result<string>
                {
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
