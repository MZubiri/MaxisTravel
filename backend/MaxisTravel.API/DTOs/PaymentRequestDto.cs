namespace MaxisTravel.API.DTOs
{
    public class PaymentRequestDto
    {
        public string TourId { get; set; } = string.Empty;
        public string TourName { get; set; } = string.Empty;
        public decimal PricePerPerson { get; set; }
        public int Passengers { get; set; } = 1;
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "USD";
        public string BuyerName { get; set; } = string.Empty;
        public string BuyerEmail { get; set; } = string.Empty;
        public string BuyerPhone { get; set; } = string.Empty;
        public string TravelDate { get; set; } = string.Empty;
    }

    public class PaymentPreferenceResponseDto
    {
        public string PreferenceId { get; set; } = string.Empty;
        public string InitPoint { get; set; } = string.Empty;
        public string SandboxInitPoint { get; set; } = string.Empty;
        public string PublicKey { get; set; } = string.Empty;
    }
}
