using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MaxisTravel.API.Data;
using MaxisTravel.API.DTOs;
using MaxisTravel.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MaxisTravel.API.Services
{
    public interface IContactService
    {
        Task<ContactMessage> CreateMessageAsync(ContactMessageCreateDto dto);
        Task<IEnumerable<ContactMessage>> GetAllMessagesAsync();
        Task<bool> MarkAsReadAsync(int id);
        Task<bool> DeleteMessageAsync(int id);
    }

    public class ContactService : IContactService
    {
        private readonly AppDbContext _context;

        public ContactService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ContactMessage> CreateMessageAsync(ContactMessageCreateDto dto)
        {
            var msg = new ContactMessage
            {
                Name = dto.Name, Email = dto.Email, Phone = dto.Phone, TourInterest = dto.TourInterest, Message = dto.Message, IsRead = false
            };
            _context.ContactMessages.Add(msg);
            await _context.SaveChangesAsync();
            return msg;
        }

        public async Task<IEnumerable<ContactMessage>> GetAllMessagesAsync()
        {
            return await _context.ContactMessages.OrderByDescending(m => m.CreatedAt).ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            var msg = await _context.ContactMessages.FindAsync(id);
            if (msg == null) return false;

            msg.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMessageAsync(int id)
        {
            var msg = await _context.ContactMessages.FindAsync(id);
            if (msg == null) return false;

            _context.ContactMessages.Remove(msg);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
