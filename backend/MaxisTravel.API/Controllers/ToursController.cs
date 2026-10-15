using System.Threading.Tasks;
using MaxisTravel.API.DTOs;
using MaxisTravel.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaxisTravel.API.Controllers
{
    [ApiController]
    public class ToursController : ControllerBase
    {
        private readonly ITourService _tourService;

        public ToursController(ITourService tourService)
        {
            _tourService = tourService;
        }

        [HttpGet("api/tours")]
        public async Task<IActionResult> GetTours([FromQuery] string? type, [FromQuery] string language = "es")
        {
            var tours = await _tourService.GetAllToursAsync(type, true, language);
            return Ok(tours);
        }

        [HttpGet("api/tours/{slug}")]
        public async Task<IActionResult> GetTourBySlug(string slug, [FromQuery] string language = "es")
        {
            var tour = await _tourService.GetTourBySlugAsync(slug, language);
            if (tour == null) return NotFound();
            return Ok(tour);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("api/admin/tours")]
        public async Task<IActionResult> GetAdminTours()
        {
            var tours = await _tourService.GetAllAdminToursAsync();
            return Ok(tours);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("api/admin/tours")]
        public async Task<IActionResult> CreateTour([FromBody] TourCreateDto dto)
        {
            var tour = await _tourService.CreateTourAsync(dto);
            return Ok(tour);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("api/admin/tours/{id}")]
        public async Task<IActionResult> UpdateTour(int id, [FromBody] TourUpdateDto dto)
        {
            var tour = await _tourService.UpdateTourAsync(id, dto);
            if (tour == null) return NotFound();
            return Ok(tour);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("api/admin/tours/{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var success = await _tourService.DeleteTourAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("api/admin/tours/{id}/toggle-publish")]
        public async Task<IActionResult> TogglePublish(int id)
        {
            var success = await _tourService.TogglePublishAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
