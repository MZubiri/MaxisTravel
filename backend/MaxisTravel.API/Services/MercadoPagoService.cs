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
    public class MpPaymentDetails
    {
        public string Id { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string StatusDetail { get; set; } = string.Empty;
        public string PaymentMethodId { get; set; } = string.Empty;
        public string ExternalReference { get; set; } = string.Empty;
        public decimal TransactionAmount { get; set; }
        public string PayerEmail { get; set; } = string.Empty;
    }

    public interface IMercadoPagoService
    {
        Task<PaymentPreferenceResponseDto> CreatePreferenceAsync(PaymentRequestDto request, string originUrl);
        Task<MpPaymentDetails?> GetPaymentDetailsAsync(string paymentId);
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
            return _configuration["MercadoPagoSettings:PublicKey"] ?? "APP_USR-07d0d64a-6428-427f-b42a-e64a80b453da";
        }

        public async Task<PaymentPreferenceResponseDto> CreatePreferenceAsync(PaymentRequestDto request, string originUrl)
        {
            var accessToken = _configuration["MercadoPagoSettings:AccessToken"] ?? "APP_USR-532959237425442-101514-67ff9879f1cc784837bd2197ca2bf715-3739838376";
            var publicKey = GetPublicKey();

            // Enforce HTTPS base URL for Mercado Pago auto_return requirement
            var baseUrl = "https://maxistravel.com";
            if (!string.IsNullOrWhiteSpace(originUrl) && !originUrl.Contains("localhost") && !originUrl.Contains("127.0.0.1"))
            {
                baseUrl = originUrl.TrimEnd('/').Replace("http://", "https://");
            }

            var splitName = (request.BuyerName ?? "Pasajero Maxis").Trim().Split(' ', 2);
            var firstName = splitName[0];
            var lastName = splitName.Length > 1 ? splitName[1] : "Pasajero";
            var extReference = $"MAXIS-{request.TourId}-{DateTime.UtcNow.Ticks}";

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
                ExternalReference = extReference,
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
                PublicKey = publicKey,
                ExternalReference = extReference
            };
        }

        public async Task<MpPaymentDetails?> GetPaymentDetailsAsync(string paymentId)
        {
            try
            {
                var accessToken = _configuration["MercadoPagoSettings:AccessToken"] ?? "APP_USR-532959237425442-101514-67ff9879f1cc784837bd2197ca2bf715-3739838376";
                var httpRequest = new HttpRequestMessage(HttpMethod.Get, $"https://api.mercadopago.com/v1/payments/{paymentId}");
                httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var response = await _httpClient.SendAsync(httpRequest);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Mercado Pago GetPaymentDetails ({response.StatusCode}): {await response.Content.ReadAsStringAsync()}");
                    return null;
                }

                var responseString = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;

                var details = new MpPaymentDetails
                {
                    Id = root.TryGetProperty("id", out var idProp) ? idProp.ToString() : paymentId,
                    Status = root.TryGetProperty("status", out var sProp) ? sProp.GetString() ?? "" : "",
                    StatusDetail = root.TryGetProperty("status_detail", out var sdProp) ? sdProp.GetString() ?? "" : "",
                    PaymentMethodId = root.TryGetProperty("payment_method_id", out var pmProp) ? pmProp.GetString() ?? "" : "",
                    ExternalReference = root.TryGetProperty("external_reference", out var erProp) ? erProp.GetString() ?? "" : ""
                };

                if (root.TryGetProperty("transaction_amount", out var taProp) && taProp.TryGetDecimal(out var amount))
                {
                    details.TransactionAmount = amount;
                }

                if (root.TryGetProperty("payer", out var payerProp) && payerProp.TryGetProperty("email", out var peProp))
                {
                    details.PayerEmail = peProp.GetString() ?? "";
                }

                return details;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error obteniendo detalles del pago {paymentId} desde Mercado Pago");
                return null;
            }
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
