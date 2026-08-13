using System;

namespace MaxisTravel.API.Models
{
    public class SiteSettings
    {
        public int Id { get; set; }
        public string SettingKey { get; set; } = null!;
        public string SettingValue { get; set; } = null!;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
