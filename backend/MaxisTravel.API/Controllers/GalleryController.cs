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
            try
            {
                var url = await _imageService.UploadImageAsync(file);
                if (url == null) return BadRequest(new { message = "El archivo está vacío." });
                return Ok(new { url });
            }
            catch (System.ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error al procesar la imagen.", detail = ex.Message });
            }
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
