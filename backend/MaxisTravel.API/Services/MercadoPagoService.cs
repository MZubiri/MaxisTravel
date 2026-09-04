using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
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

            var preferencePayload = new MpPreferencePayload
            {
                Items = new List<MpItemPayload>
                {
                    new MpItemPayload
                    {
                        Id = string.IsNullOrEmpty(request.TourId) ? "tour-general" : request.TourId,
                        Title = $"Tour: {request.TourName} ({request.Passengers} pers. - {request.TravelDate})",
                        Description = $"Reserva de tour {request.TourName} en Cusco con MaxisTravel",
                        CategoryId = "travel",
                        Quantity = 1,
                        CurrencyId = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency.ToUpper(),
                        UnitPrice = request.TotalAmount
                    }
                },
                Payer = new MpPayerPayload
                {
                    Name = firstName,
                    Surname = lastName,
                    Email = string.IsNullOrWhiteSpace(request.BuyerEmail) ? "cliente@maxistravel.com" : request.BuyerEmail,
                    Phone = new MpPhonePayload
                    {
                        AreaCode = "51",
                        Number = string.IsNullOrWhiteSpace(request.BuyerPhone) ? "920698122" : request.BuyerPhone.Replace(" ", "").Replace("+", "")
                    }
                },
                BackUrls = new MpBackUrlsPayload
                {
                    Success = $"{baseUrl}/tours?payment=approved",
                    Failure = $"{baseUrl}/tours?payment=failure",
                    Pending = $"{baseUrl}/tours?payment=pending"
                },
                AutoReturn = "approved",
                ExternalReference = $"MAXIS-{request.TourId}-{DateTime.UtcNow.Ticks}",
                StatementDescriptor = "MAXISTRAVEL"
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

    public class MpPreferencePayload
    {
        [JsonPropertyName("items")]
        public List<MpItemPayload> Items { get; set; } = new();

        [JsonPropertyName("payer")]
        public MpPayerPayload Payer { get; set; } = new();

        [JsonPropertyName("back_urls")]
        public MpBackUrlsPayload BackUrls { get; set; } = new();

        [JsonPropertyName("auto_return")]
        public string AutoReturn { get; set; } = "approved";

        [JsonPropertyName("external_reference")]
        public string ExternalReference { get; set; } = string.Empty;

        [JsonPropertyName("statement_descriptor")]
        public string StatementDescriptor { get; set; } = "MAXISTRAVEL";
    }

    public class MpItemPayload
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("category_id")]
        public string CategoryId { get; set; } = "travel";

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; } = 1;

        [JsonPropertyName("currency_id")]
        public string CurrencyId { get; set; } = "USD";

        [JsonPropertyName("unit_price")]
        public decimal UnitPrice { get; set; }
    }

    public class MpPayerPayload
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("surname")]
        public string Surname { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phone")]
        public MpPhonePayload Phone { get; set; } = new();
    }

    public class MpPhonePayload
    {
        [JsonPropertyName("area_code")]
        public string AreaCode { get; set; } = "51";

        [JsonPropertyName("number")]
        public string Number { get; set; } = string.Empty;
    }

    public class MpBackUrlsPayload
    {
        [JsonPropertyName("success")]
        public string Success { get; set; } = string.Empty;

        [JsonPropertyName("failure")]
        public string Failure { get; set; } = string.Empty;

        [JsonPropertyName("pending")]
        public string Pending { get; set; } = string.Empty;
    }
}
