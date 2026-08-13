namespace MaxisTravel.API.Models
{
    public class ColorPalette
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; }
        public string PrimaryColor { get; set; } = null!;
        public string SecondaryColor { get; set; } = null!;
        public string AccentColor { get; set; } = null!;
        public string LightColor { get; set; } = null!;
        public string DarkColor { get; set; } = null!;
        public string BackgroundColor { get; set; } = null!;
    }
}
