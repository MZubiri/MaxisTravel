using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MaxisTravel.API.Data;
using MaxisTravel.API.DTOs;
using MaxisTravel.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MaxisTravel.API.Services
{
    public interface ISettingsService
    {
        Task<SiteSettingsDto> GetSettingsAsync();
        Task UpdateSettingsAsync(SiteSettingsDto dto);
        Task<ColorPaletteDto?> GetActivePaletteAsync();
        Task<IEnumerable<ColorPaletteDto>> GetAllPalettesAsync();
        Task<bool> SetActivePaletteAsync(int id);
    }

    public class SettingsService : ISettingsService
    {
        private readonly AppDbContext _context;

        public SettingsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<SiteSettingsDto> GetSettingsAsync()
        {
            var settings = await _context.SiteSettings.ToListAsync();
            var dto = new SiteSettingsDto();
            foreach (var s in settings)
            {
                dto.Settings[s.SettingKey] = s.SettingValue;
            }
            return dto;
        }

        public async Task UpdateSettingsAsync(SiteSettingsDto dto)
        {
            var current = await _context.SiteSettings.ToListAsync();
            
            foreach (var kvp in dto.Settings)
            {
                var setting = current.FirstOrDefault(s => s.SettingKey == kvp.Key);
                if (setting != null)
                {
                    setting.SettingValue = kvp.Value;
                    setting.UpdatedAt = System.DateTime.UtcNow;
                }
                else
                {
                    _context.SiteSettings.Add(new SiteSettings { SettingKey = kvp.Key, SettingValue = kvp.Value });
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task<ColorPaletteDto?> GetActivePaletteAsync()
        {
            var p = await _context.ColorPalettes.FirstOrDefaultAsync(x => x.IsActive);
            if (p == null) return null;
            return Map(p);
        }

        public async Task<IEnumerable<ColorPaletteDto>> GetAllPalettesAsync()
        {
            return await _context.ColorPalettes.Select(p => Map(p)).ToListAsync();
        }

        public async Task<bool> SetActivePaletteAsync(int id)
        {
            var palettes = await _context.ColorPalettes.ToListAsync();
            var target = palettes.FirstOrDefault(p => p.Id == id);
            if (target == null) return false;

            foreach (var p in palettes)
            {
                p.IsActive = (p.Id == id);
            }
            await _context.SaveChangesAsync();
            return true;
        }

        private static ColorPaletteDto Map(ColorPalette p) => new ColorPaletteDto
        {
            Id = p.Id, Name = p.Name, IsActive = p.IsActive, PrimaryColor = p.PrimaryColor, SecondaryColor = p.SecondaryColor,
            AccentColor = p.AccentColor, LightColor = p.LightColor, DarkColor = p.DarkColor, BackgroundColor = p.BackgroundColor
        };
    }
}
