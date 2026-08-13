using System;
using System.Collections.Generic;

namespace MaxisTravel.API.DTOs
{
    public class TourDto
    {
        public int Id { get; set; }
        public string Slug { get; set; } = null!;
        public decimal Price { get; set; }
        public string Currency { get; set; } = null!;
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

    public class TourTranslationDto
    {
        public int Id { get; set; }
        public string LanguageCode { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;
        public string FullDescription { get; set; } = null!;
        public string WhatToBring { get; set; } = null!;
    }

    public class TourItineraryDto
    {
        public int Id { get; set; }
        public string TimeSlot { get; set; } = null!;
        public string TitleEs { get; set; } = null!;
        public string TitleEn { get; set; } = null!;
        public string DescriptionEs { get; set; } = null!;
        public string DescriptionEn { get; set; } = null!;
        public string? Icon { get; set; }
        public int SortOrder { get; set; }
    }

    public class TourInclusionDto
    {
        public int Id { get; set; }
        public string TextEs { get; set; } = null!;
        public string TextEn { get; set; } = null!;
        public bool IsIncluded { get; set; }
        public int SortOrder { get; set; }
    }

    public class TourImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = null!;
        public string AltText { get; set; } = null!;
        public int SortOrder { get; set; }
        public bool IsPrimary { get; set; }
    }
}
