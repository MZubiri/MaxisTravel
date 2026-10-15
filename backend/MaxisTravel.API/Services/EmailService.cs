using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using MaxisTravel.API.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MaxisTravel.API.Services
{
    public interface IEmailService
    {
        Task<bool> SendContactNotificationAsync(ContactMessage message);
        Task<bool> SendBookingConfirmationAsync(Booking booking);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendContactNotificationAsync(ContactMessage message)
        {
            var adminEmail = _configuration["SmtpSettings:AdminNotificationEmail"] ?? "info@maxistravel.com";
            var subject = $"📬 Nueva consulta web de {message.Name} - {message.TourInterest ?? "General"}";
            
            var bodyHtml = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px;'>
                    <h2 style='color: #C26148;'>Nueva Consulta en MaxisTravel Cusco</h2>
                    <p>Has recibido una nueva consulta a través del formulario de la web:</p>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Nombre:</td><td>{message.Name}</td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Email:</td><td><a href='mailto:{message.Email}'>{message.Email}</a></td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Teléfono:</td><td><a href='tel:{message.Phone}'>{message.Phone}</a></td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Tour de Interés:</td><td>{message.TourInterest ?? "Consulta General"}</td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Fecha:</td><td>{message.CreatedAt:dd/MM/yyyy HH:mm} UTC</td></tr>
                    </table>
                    <div style='background: #F8FAFC; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #C97F6C;'>
                        <strong>Mensaje:</strong>
                        <p style='margin: 8px 0 0 0; color: #334155;'>{message.Message}</p>
                    </div>
                    <div style='margin-top: 20px; text-align: center;'>
                        <a href='https://wa.me/51{message.Phone.Replace("+", "").Replace(" ", "")}' style='background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Responder por WhatsApp</a>
                    </div>
                </div>";

            return await SendEmailAsync(adminEmail, subject, bodyHtml);
        }

        public async Task<bool> SendBookingConfirmationAsync(Booking booking)
        {
            var adminEmail = _configuration["SmtpSettings:AdminNotificationEmail"] ?? "info@maxistravel.com";
            
            var statusLabel = booking.Status == "Approved" ? "CONFIRMADO ✅" : "PENDIENTE ⏳";
            var subjectAdmin = $"💳 Pago {statusLabel}: Reserva de {booking.CustomerName} ({booking.TourName})";
            
            var bodyHtmlAdmin = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px;'>
                    <h2 style='color: #166534;'>Reserva con Mercado Pago: {statusLabel}</h2>
                    <p>Se ha registrado una transacción de reserva en la web:</p>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Tour:</td><td>{booking.TourName}</td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Pasajeros:</td><td>{booking.Passengers}</td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Fecha del Tour:</td><td>{booking.TravelDate}</td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Monto Total:</td><td><strong>{booking.Currency} {booking.TotalAmount}</strong></td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Cliente:</td><td>{booking.CustomerName}</td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Email:</td><td><a href='mailto:{booking.CustomerEmail}'>{booking.CustomerEmail}</a></td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Teléfono:</td><td>{booking.CustomerPhone}</td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>Estado Pago:</td><td><span style='background: #DCFCE7; color: #166534; padding: 4px 8px; border-radius: 4px; font-weight: bold;'>{booking.Status}</span></td></tr>
                        <tr><td style='padding: 8px 0; font-weight: bold;'>ID Pago MP:</td><td>{booking.PaymentId ?? booking.PreferenceId}</td></tr>
                    </table>
                </div>";

            // Also send confirmation to customer if email is valid
            var bodyHtmlCustomer = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px;'>
                    <h2 style='color: #C26148;'>¡Hola {booking.CustomerName}! Tu reserva en Cusco</h2>
                    <p>Gracias por reservar con <strong>MaxisTravel</strong>. Hemos recibido tu solicitud para el tour:</p>
                    <div style='background: #F8FAFC; padding: 15px; border-radius: 8px; margin: 15px 0;'>
                        <h3 style='margin: 0 0 10px 0; color: #1A1A2E;'>{booking.TourName}</h3>
                        <p style='margin: 4px 0;'>📅 <strong>Fecha:</strong> {booking.TravelDate}</p>
                        <p style='margin: 4px 0;'>👥 <strong>Pasajeros:</strong> {booking.Passengers}</p>
                        <p style='margin: 4px 0;'>💵 <strong>Total:</strong> {booking.Currency} {booking.TotalAmount}</p>
                        <p style='margin: 4px 0;'>🏷️ <strong>Estado del Pago:</strong> {booking.Status}</p>
                    </div>
                    <p>Nuestro equipo de guías y coordinadores te contactará por WhatsApp para afinar los detalles de tu recojo.</p>
                    <p>Cualquier consulta inmediata, puedes escribirnos al WhatsApp: <strong>+51 920 698 122</strong></p>
                </div>";

            var resAdmin = await SendEmailAsync(adminEmail, subjectAdmin, bodyHtmlAdmin);
            if (!string.IsNullOrWhiteSpace(booking.CustomerEmail) && booking.CustomerEmail.Contains("@"))
            {
                await SendEmailAsync(booking.CustomerEmail, $"Confirmación de Reserva - {booking.TourName} | MaxisTravel", bodyHtmlCustomer);
            }

            return resAdmin;
        }

        private async Task<bool> SendEmailAsync(string toEmail, string subject, string bodyHtml)
        {
            var host = _configuration["SmtpSettings:Host"];
            var user = _configuration["SmtpSettings:Username"];
            var pass = _configuration["SmtpSettings:Password"];
            var fromEmail = _configuration["SmtpSettings:SenderEmail"] ?? "info@maxistravel.com";
            var fromName = _configuration["SmtpSettings:SenderName"] ?? "MaxisTravel Cusco";

            // If SMTP credentials not provided, log cleanly as simulated email
            if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(pass))
            {
                _logger.LogInformation($"[EMAIL SIMULADO] Destino: {toEmail} | Asunto: {subject}");
                return true;
            }

            try
            {
                var port = int.Parse(_configuration["SmtpSettings:Port"] ?? "587");
                var enableSsl = bool.Parse(_configuration["SmtpSettings:EnableSsl"] ?? "true");

                using var message = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = bodyHtml,
                    IsBodyHtml = true
                };
                message.To.Add(toEmail);

                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(user, pass),
                    EnableSsl = enableSsl
                };

                await client.SendMailAsync(message);
                _logger.LogInformation($"Email enviado exitosamente a {toEmail} ({subject})");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error enviando email a {toEmail}: {ex.Message}");
                return false;
            }
        }
    }
}
