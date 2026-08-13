using System.Threading.Tasks;
using MaxisTravel.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MaxisTravel.API.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class GalleryController : ControllerBase
    {
        private readonly IImageService _imageService;

        public GalleryController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            var url = await _imageService.UploadImageAsync(file);
            if (url == null) return BadRequest("File is empty");
            return Ok(new { url });
        }

        [HttpDelete]
        public IActionResult DeleteImage([FromQuery] string url)
        {
            var success = _imageService.DeleteImage(url);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
