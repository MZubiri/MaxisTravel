namespace MaxisTravel.API.Models
{
    public class TourInclusion
    {
        public int Id { get; set; }
        public int TourId { get; set; }
        public Tour Tour { get; set; } = null!;
        public string TextEs { get; set; } = null!;
        public string TextEn { get; set; } = null!;
        public bool IsIncluded { get; set; }
        public int SortOrder { get; set; }
    }
}
