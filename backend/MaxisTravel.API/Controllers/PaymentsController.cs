using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using MaxisTravel.API.Data;
using MaxisTravel.API.DTOs;
using MaxisTravel.API.Models;
using MaxisTravel.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MaxisTravel.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IMercadoPagoService _mercadoPagoService;
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(
            IMercadoPagoService mercadoPagoService,
            AppDbContext context,
            IEmailService emailService,
            ILogger<PaymentsController> logger)
        {
            _mercadoPagoService = mercadoPagoService;
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpGet("config")]
        public IActionResult GetConfig()
        {
            return Ok(new { publicKey = _mercadoPagoService.GetPublicKey() });
        }

        [HttpPost("create-preference")]
        public async Task<IActionResult> CreatePreference([FromBody] PaymentRequestDto request)
        {
            try
            {
                if (request == null || request.TotalAmount <= 0)
                {
                    return BadRequest(new { message = "Monto total inválido para la reserva." });
                }

                var originUrl = $"{Request.Scheme}://{Request.Host}";
                var result = await _mercadoPagoService.CreatePreferenceAsync(request, originUrl);

                // Persist the reservation as Pending in the database
                var booking = new Booking
                {
                    TourId = request.TourId ?? "tour-general",
                    TourName = request.TourName ?? "Tour Cusco",
                    CustomerName = string.IsNullOrWhiteSpace(request.BuyerName) ? "Pasajero Maxis" : request.BuyerName,
                    CustomerEmail = request.BuyerEmail ?? "",
                    CustomerPhone = request.BuyerPhone ?? "",
                    TravelDate = request.TravelDate ?? DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    Passengers = request.Passengers > 0 ? request.Passengers : 1,
                    TotalAmount = request.TotalAmount,
                    Currency = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency.ToUpper(),
                    PreferenceId = result.PreferenceId,
                    ExternalReference = result.ExternalReference,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Bookings.AddAsync(booking);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Reserva #{booking.Id} creada en estado Pendiente para '{booking.TourName}' (Ref: {booking.ExternalReference})");

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear preferencia de Mercado Pago");
                return StatusCode(500, new { message = "No se pudo procesar la solicitud con Mercado Pago.", detail = ex.Message });
            }
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook(
            [FromBody] JsonElement? body,
            [FromQuery] string? topic,
            [FromQuery] string? id,
            [FromQuery] string? type,
            [FromQuery(Name = "data.id")] string? dataId)
        {
            try
            {
                _logger.LogInformation($"[Webhook MP] Query: topic={topic}, type={type}, id={id}, data.id={dataId}. Body: {body?.ToString()}");

                string? paymentId = null;

                // Case 1: ID from query params
                if (!string.IsNullOrEmpty(dataId))
                {
                    paymentId = dataId;
                }
                else if (!string.IsNullOrEmpty(id) && (topic == "payment" || type == "payment" || string.IsNullOrEmpty(topic)))
                {
                    paymentId = id;
                }

                // Case 2: ID from JSON Body
                if (string.IsNullOrEmpty(paymentId) && body.HasValue && body.Value.ValueKind == JsonValueKind.Object)
                {
                    if (body.Value.TryGetProperty("data", out var dataEl) && dataEl.TryGetProperty("id", out var idProp))
                    {
                        paymentId = idProp.GetString() ?? idProp.ToString();
                    }
                    else if (body.Value.TryGetProperty("id", out var rootIdProp))
                    {
                        paymentId = rootIdProp.GetString() ?? rootIdProp.ToString();
                    }
                }

                if (!string.IsNullOrEmpty(paymentId))
                {
                    _logger.LogInformation($"[Webhook MP] Procesando pago ID: {paymentId}");
                    var payment = await _mercadoPagoService.GetPaymentDetailsAsync(paymentId);

                    if (payment != null)
                    {
                        // Match booking by ExternalReference or PaymentId
                        Booking? booking = null;
                        if (!string.IsNullOrEmpty(payment.ExternalReference))
                        {
                            booking = await _context.Bookings.FirstOrDefaultAsync(b => b.ExternalReference == payment.ExternalReference);
                        }

                        if (booking == null)
                        {
                            booking = await _context.Bookings.FirstOrDefaultAsync(b => b.PaymentId == payment.Id);
                        }

                        if (booking != null)
                        {
                            booking.PaymentId = payment.Id;
                            booking.PaymentMethod = payment.PaymentMethodId;
                            booking.Status = payment.Status?.ToLower() switch
                            {
                                "approved" => "Approved",
                                "in_process" => "InProcess",
                                "pending" => "InProcess",
                                "rejected" => "Rejected",
                                "cancelled" => "Cancelled",
                                _ => payment.Status ?? booking.Status
                            };
                            booking.UpdatedAt = DateTime.UtcNow;

                            await _context.SaveChangesAsync();
                            _logger.LogInformation($"[Webhook MP] Reserva #{booking.Id} actualizada a estado '{booking.Status}'.");

                            // Send confirmation email when approved
                            if (booking.Status == "Approved")
                            {
                                await _emailService.SendBookingConfirmationAsync(booking);
                            }
                        }
                        else
                        {
                            _logger.LogWarning($"[Webhook MP] No se encontró reserva local para ExtRef: {payment.ExternalReference} o PaymentId: {payment.Id}");
                        }
                    }
                }

                return Ok(new { status = "received" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error procesando webhook de Mercado Pago");
                return Ok(new { status = "error", message = ex.Message });
            }
        }

        // ==================== ADMIN ENDPOINTS ====================

        [HttpGet("/api/admin/bookings")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminBookings([FromQuery] string? status)
        {
            var query = _context.Bookings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all")
            {
                query = query.Where(b => b.Status.ToLower() == status.ToLower());
            }

            var bookings = await query
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPatch("/api/admin/bookings/{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusDto dto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = $"Reserva con ID {id} no encontrada." });
            }

            if (!string.IsNullOrWhiteSpace(dto.Status))
            {
                booking.Status = dto.Status;
                booking.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                if (booking.Status == "Approved")
                {
                    await _emailService.SendBookingConfirmationAsync(booking);
                }
            }

            return Ok(booking);
        }

        [HttpDelete("/api/admin/bookings/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = $"Reserva con ID {id} no encontrada." });
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
