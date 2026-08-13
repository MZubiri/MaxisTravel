namespace MaxisTravel.API.Models
{
    public class TourImage
    {
        public int Id { get; set; }
        public int TourId { get; set; }
        public Tour Tour { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public string AltText { get; set; } = null!;
        public int SortOrder { get; set; }
        public bool IsPrimary { get; set; }
    }
}
