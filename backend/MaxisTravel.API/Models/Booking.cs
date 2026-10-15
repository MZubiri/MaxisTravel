using System;

namespace MaxisTravel.API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public string TourId { get; set; } = string.Empty;
        public string TourName { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string TravelDate { get; set; } = string.Empty;
        public int Passengers { get; set; } = 1;
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "USD";
        public string PreferenceId { get; set; } = string.Empty;
        public string? PaymentId { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, InProcess, Rejected, Cancelled
        public string? PaymentMethod { get; set; }
        public string? ExternalReference { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
