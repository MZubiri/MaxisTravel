namespace MaxisTravel.API.Models
{
    public class TourItinerary
    {
        public int Id { get; set; }
        public int TourId { get; set; }
        public Tour Tour { get; set; } = null!;
        public string TimeSlot { get; set; } = null!;
        public string TitleEs { get; set; } = null!;
        public string TitleEn { get; set; } = null!;
        public string DescriptionEs { get; set; } = null!;
        public string DescriptionEn { get; set; } = null!;
        public string? Icon { get; set; }
        public int SortOrder { get; set; }
    }
}
