using System.Threading.Tasks;
using MaxisTravel.API.DTOs;
using MaxisTravel.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaxisTravel.API.Controllers
{
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;
        private readonly IEmailService _emailService;

        public ContactController(IContactService contactService, IEmailService emailService)
        {
            _contactService = contactService;
            _emailService = emailService;
        }

        [HttpPost("api/contact")]
        public async Task<IActionResult> CreateMessage([FromBody] ContactMessageCreateDto dto)
        {
            var msg = await _contactService.CreateMessageAsync(dto);
            // Asynchronously send email notification
            _ = Task.Run(() => _emailService.SendContactNotificationAsync(msg));
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("api/admin/messages")]
        public async Task<IActionResult> GetMessages()
        {
            return Ok(await _contactService.GetAllMessagesAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("api/admin/messages/{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var success = await _contactService.MarkAsReadAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
