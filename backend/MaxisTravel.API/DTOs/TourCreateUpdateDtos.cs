using System.Collections.Generic;

namespace MaxisTravel.API.DTOs
{
    public class TourCreateDto
    {
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

        public List<TourTranslationDto> Translations { get; set; } = new();
        public List<TourItineraryDto> Itineraries { get; set; } = new();
        public List<TourInclusionDto> Inclusions { get; set; } = new();
        public List<TourImageDto> Images { get; set; } = new();
    }

    public class TourUpdateDto : TourCreateDto
    {
        public int Id { get; set; }
    }
}
