using System.Collections.Generic;

namespace MaxisTravel.API.DTOs
{
    public class SiteSettingsDto
    {
        public Dictionary<string, string> Settings { get; set; } = new();
    }

    public class ColorPaletteDto
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

    public class PaletteUpdateDto
    {
        public bool IsActive { get; set; }
    }
}
