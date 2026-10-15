namespace MaxisTravel.API.Models
{
    public class TourTranslation
    {
        public int Id { get; set; }
        public int TourId { get; set; }
        public Tour Tour { get; set; } = null!;
        public string LanguageCode { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;
        public string FullDescription { get; set; } = null!;
        public string WhatToBring { get; set; } = string.Empty;
    }
}
