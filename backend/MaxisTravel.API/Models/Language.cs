namespace MaxisTravel.API.Models
{
    public class Language
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string NativeName { get; set; } = null!;
        public string FlagEmoji { get; set; } = null!;
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }
}
