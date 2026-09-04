using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MaxisTravel.API.DTOs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MaxisTravel.API.Services
{
    public interface IMercadoPagoService
    {
        Task<PaymentPreferenceResponseDto> CreatePreferenceAsync(PaymentRequestDto request, string originUrl);
        string GetPublicKey();
    }

    public class MercadoPagoService : IMercadoPagoService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<MercadoPagoService> _logger;

        public MercadoPagoService(HttpClient httpClient, IConfiguration configuration, ILogger<MercadoPagoService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public string GetPublicKey()
        {
            return _configuration["MercadoPagoSettings:PublicKey"] ?? "APP_USR-34d6e223-2266-4ade-ab48-feb3064fa79b";
        }

        public async Task<PaymentPreferenceResponseDto> CreatePreferenceAsync(PaymentRequestDto request, string originUrl)
        {
            var accessToken = _configuration["MercadoPagoSettings:AccessToken"] ?? "APP_USR-5352056971681212-090321-1118220f55a88fe40544f52301a25727-3656504962";
            var publicKey = GetPublicKey();

            var baseUrl = string.IsNullOrWhiteSpace(originUrl) || originUrl.Contains("localhost") 
                ? "https://maxistravel.com" 
                : originUrl.TrimEnd('/');

            var splitName = (request.BuyerName ?? "Pasajero Maxis").Trim().Split(' ', 2);
            var firstName = splitName[0];
            var lastName = splitName.Length > 1 ? splitName[1] : "Pasajero";

            var preferencePayload = new
            {
                items = new[]
                {
                    new
                    {
                        id = string.IsNullOrEmpty(request.TourId) ? "tour-general" : request.TourId,
                        title = $"Tour: {request.TourName} ({request.Passengers} pers. - {request.TravelDate})",
                        description = $"Reserva de tour {request.TourName} en Cusco con MaxisTravel",
                        category_id = "travel",
                        quantity = 1,
                        currency_id = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency.ToUpper(),
                        unit_price = (double)request.TotalAmount
                    }
                },
                payer = new
                {
                    name = firstName,
                    surname = lastName,
                    email = string.IsNullOrWhiteSpace(request.BuyerEmail) ? "cliente@maxistravel.com" : request.BuyerEmail,
                    phone = new
                    {
                        area_code = "51",
                        number = string.IsNullOrWhiteSpace(request.BuyerPhone) ? "920698122" : request.BuyerPhone.Replace(" ", "").Replace("+", "")
                    }
                },
                back_urls = new
                {
                    success = $"{baseUrl}/tours?payment=approved",
                    failure = $"{baseUrl}/tours?payment=failure",
                    pending = $"{baseUrl}/tours?payment=pending"
                },
                auto_return = "approved",
                external_reference = $"MAXIS-{request.TourId}-{DateTime.UtcNow.Ticks}",
                statement_descriptor = "MAXISTRAVEL"
            };

            var jsonContent = JsonSerializer.Serialize(preferencePayload);
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://api.mercadopago.com/checkout/preferences")
            {
                Content = new StringContent(jsonContent, Encoding.UTF8, "application/json")
            };
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(httpRequest);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"Mercado Pago API Error ({response.StatusCode}): {responseString}");
                throw new Exception($"Mercado Pago error: {response.StatusCode} - {responseString}");
            }

            using var doc = JsonDocument.Parse(responseString);
            var root = doc.RootElement;

            string prefId = root.TryGetProperty("id", out var idProp) ? idProp.GetString() ?? "" : "";
            string initPoint = root.TryGetProperty("init_point", out var initProp) ? initProp.GetString() ?? "" : "";
            string sandboxInitPoint = root.TryGetProperty("sandbox_init_point", out var sandboxProp) ? sandboxProp.GetString() ?? "" : "";

            return new PaymentPreferenceResponseDto
            {
                PreferenceId = prefId,
                InitPoint = initPoint,
                SandboxInitPoint = sandboxInitPoint,
                PublicKey = publicKey
            };
        }
    }
}
