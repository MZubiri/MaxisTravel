using System.Threading.Tasks;
using MaxisTravel.API.DTOs;
using MaxisTravel.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaxisTravel.API.Controllers
{
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        [HttpGet("api/settings")]
        public async Task<IActionResult> GetSettings()
        {
            return Ok(await _settingsService.GetSettingsAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("api/admin/settings")]
        public async Task<IActionResult> UpdateSettings([FromBody] SiteSettingsDto dto)
        {
            await _settingsService.UpdateSettingsAsync(dto);
            return NoContent();
        }

        [HttpGet("api/palettes")]
        public async Task<IActionResult> GetPalettes()
        {
            return Ok(await _settingsService.GetAllPalettesAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("api/admin/palettes/{id}/activate")]
        public async Task<IActionResult> ActivatePalette(int id)
        {
            var success = await _settingsService.SetActivePaletteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
