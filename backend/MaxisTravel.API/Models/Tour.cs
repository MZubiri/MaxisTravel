using System;
using System.Collections.Generic;

namespace MaxisTravel.API.Models
{
    public class Tour
    {
        public int Id { get; set; }
        public string Slug { get; set; } = null!;
        public decimal Price { get; set; }
        public string Currency { get; set; } = "USD";
        public string Duration { get; set; } = null!;
        public string DifficultyLevel { get; set; } = null!;
        public string TourType { get; set; } = null!;
        public string? MaxAltitude { get; set; }
        public string Schedule { get; set; } = null!;
        public string Modality { get; set; } = null!;
        public bool IsPublished { get; set; }
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TourTranslation> Translations { get; set; } = new List<TourTranslation>();
        public ICollection<TourItinerary> Itineraries { get; set; } = new List<TourItinerary>();
        public ICollection<TourInclusion> Inclusions { get; set; } = new List<TourInclusion>();
        public ICollection<TourImage> Images { get; set; } = new List<TourImage>();
    }
}
