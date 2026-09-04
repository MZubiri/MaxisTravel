using System;
using System.Threading.Tasks;
using MaxisTravel.API.DTOs;
using MaxisTravel.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MaxisTravel.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IMercadoPagoService _mercadoPagoService;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(IMercadoPagoService mercadoPagoService, ILogger<PaymentsController> logger)
        {
            _mercadoPagoService = mercadoPagoService;
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
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear preferencia de Mercado Pago");
                return StatusCode(500, new { message = "No se pudo procesar la solicitud con Mercado Pago.", detail = ex.Message });
            }
        }

        [HttpPost("webhook")]
        public IActionResult Webhook([FromBody] object body)
        {
            _logger.LogInformation($"IPN/Webhook recibido de Mercado Pago: {body}");
            return Ok(new { status = "received" });
        }
    }
}
