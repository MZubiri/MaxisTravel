using System.Threading.Tasks;
using MaxisTravel.API.DTOs;
using MaxisTravel.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaxisTravel.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (result == null) return Unauthorized(new { message = "Credenciales inválidas" });
            return Ok(result);
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username)) return Unauthorized(new { message = "Sesión no válida" });

            var (success, message) = await _authService.ChangePasswordAsync(username, dto);
            if (!success) return BadRequest(new { message });
            return Ok(new { message });
        }
    }
}

