using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MaxisTravel.API.Data;
using MaxisTravel.API.DTOs;
using MaxisTravel.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MaxisTravel.API.Services
{
    public interface ITourService
    {
        Task<IEnumerable<TourDto>> GetAllToursAsync(string? type = null, bool? published = null, string language = "es");
        Task<IEnumerable<Tour>> GetAllAdminToursAsync();
        Task<TourDto?> GetTourBySlugAsync(string slug, string language = "es");
        Task<Tour?> GetTourByIdAsync(int id);
        Task<Tour> CreateTourAsync(TourCreateDto dto);
        Task<Tour?> UpdateTourAsync(int id, TourUpdateDto dto);
        Task<bool> DeleteTourAsync(int id);
        Task<bool> TogglePublishAsync(int id);
    }

    public class TourService : ITourService
    {
        private readonly AppDbContext _context;

        public TourService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TourDto>> GetAllToursAsync(string? type = null, bool? published = null, string language = "es")
        {
            var query = _context.Tours
                .Include(t => t.Translations.Where(tr => tr.LanguageCode == language))
                .Include(t => t.Images)
                .AsQueryable();

            if (!string.IsNullOrEmpty(type))
                query = query.Where(t => t.TourType == type);
                
            if (published.HasValue)
                query = query.Where(t => t.IsPublished == published.Value);

            var tours = await query.OrderBy(t => t.SortOrder).ToListAsync();
            
            return tours.Select(t => MapToDto(t, language));
        }

        public async Task<IEnumerable<Tour>> GetAllAdminToursAsync()
        {
            return await _context.Tours
                .Include(t => t.Translations)
                .OrderBy(t => t.SortOrder)
                .ToListAsync();
        }

        public async Task<TourDto?> GetTourBySlugAsync(string slug, string language = "es")
        {
            var tour = await _context.Tours
                .Include(t => t.Translations.Where(tr => tr.LanguageCode == language))
                .Include(t => t.Itineraries)
                .Include(t => t.Inclusions)
                .Include(t => t.Images)
                .FirstOrDefaultAsync(t => t.Slug == slug);

            if (tour == null) return null;

            return MapToDto(tour, language);
        }
        
        public async Task<Tour?> GetTourByIdAsync(int id)
        {
            return await _context.Tours
                .Include(t => t.Translations)
                .Include(t => t.Itineraries)
                .Include(t => t.Inclusions)
                .Include(t => t.Images)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Tour> CreateTourAsync(TourCreateDto dto)
        {
            var tour = new Tour
            {
                Slug = dto.Slug,
                Price = dto.Price,
                Currency = dto.Currency,
                Duration = dto.Duration,
                DifficultyLevel = dto.DifficultyLevel,
                TourType = dto.TourType,
                MaxAltitude = dto.MaxAltitude,
                Schedule = dto.Schedule,
                Modality = dto.Modality,
                IsPublished = dto.IsPublished,
                SortOrder = dto.SortOrder,
                Translations = dto.Translations.Select(tr => new TourTranslation
                {
                    LanguageCode = tr.LanguageCode,
                    Title = tr.Title,
                    ShortDescription = tr.ShortDescription,
                    FullDescription = tr.FullDescription,
                    WhatToBring = tr.WhatToBring
                }).ToList(),
                Itineraries = dto.Itineraries.Select(i => new TourItinerary
                {
                    TimeSlot = i.TimeSlot, TitleEs = i.TitleEs, TitleEn = i.TitleEn, DescriptionEs = i.DescriptionEs, DescriptionEn = i.DescriptionEn, Icon = i.Icon, SortOrder = i.SortOrder
                }).ToList(),
                Inclusions = dto.Inclusions.Select(i => new TourInclusion
                {
                    TextEs = i.TextEs, TextEn = i.TextEn, IsIncluded = i.IsIncluded, SortOrder = i.SortOrder
                }).ToList(),
                Images = dto.Images.Select(i => new TourImage
                {
                    ImageUrl = i.ImageUrl, AltText = i.AltText, SortOrder = i.SortOrder, IsPrimary = i.IsPrimary
                }).ToList()
            };

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();
            return tour;
        }

        public async Task<Tour?> UpdateTourAsync(int id, TourUpdateDto dto)
        {
            var tour = await GetTourByIdAsync(id);
            if (tour == null) return null;

            tour.Slug = dto.Slug;
            tour.Price = dto.Price;
            tour.Currency = dto.Currency;
            tour.Duration = dto.Duration;
            tour.DifficultyLevel = dto.DifficultyLevel;
            tour.TourType = dto.TourType;
            tour.MaxAltitude = dto.MaxAltitude;
            tour.Schedule = dto.Schedule;
            tour.Modality = dto.Modality;
            tour.IsPublished = dto.IsPublished;
            tour.SortOrder = dto.SortOrder;
            tour.UpdatedAt = System.DateTime.UtcNow;

            _context.TourTranslations.RemoveRange(tour.Translations);
            _context.TourItineraries.RemoveRange(tour.Itineraries);
            _context.TourInclusions.RemoveRange(tour.Inclusions);
            _context.TourImages.RemoveRange(tour.Images);
            
            tour.Translations = dto.Translations.Select(tr => new TourTranslation { LanguageCode = tr.LanguageCode, Title = tr.Title, ShortDescription = tr.ShortDescription, FullDescription = tr.FullDescription, WhatToBring = tr.WhatToBring }).ToList();
            tour.Itineraries = dto.Itineraries.Select(i => new TourItinerary { TimeSlot = i.TimeSlot, TitleEs = i.TitleEs, TitleEn = i.TitleEn, DescriptionEs = i.DescriptionEs, DescriptionEn = i.DescriptionEn, Icon = i.Icon, SortOrder = i.SortOrder }).ToList();
            tour.Inclusions = dto.Inclusions.Select(i => new TourInclusion { TextEs = i.TextEs, TextEn = i.TextEn, IsIncluded = i.IsIncluded, SortOrder = i.SortOrder }).ToList();
            tour.Images = dto.Images.Select(i => new TourImage { ImageUrl = i.ImageUrl, AltText = i.AltText, SortOrder = i.SortOrder, IsPrimary = i.IsPrimary }).ToList();

            await _context.SaveChangesAsync();
            return tour;
        }

        public async Task<bool> DeleteTourAsync(int id)
        {
            var tour = await _context.Tours.FindAsync(id);
            if (tour == null) return false;
            
            _context.Tours.Remove(tour);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> TogglePublishAsync(int id)
        {
            var tour = await _context.Tours.FindAsync(id);
            if (tour == null) return false;

            tour.IsPublished = !tour.IsPublished;
            tour.UpdatedAt = System.DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        private TourDto MapToDto(Tour t, string language)
        {
            return new TourDto
            {
                Id = t.Id, Slug = t.Slug, Price = t.Price, Currency = t.Currency, Duration = t.Duration, DifficultyLevel = t.DifficultyLevel,
                TourType = t.TourType, MaxAltitude = t.MaxAltitude, Schedule = t.Schedule, Modality = t.Modality, IsPublished = t.IsPublished, SortOrder = t.SortOrder,
                Translations = t.Translations.Select(tr => new TourTranslationDto { Id = tr.Id, LanguageCode = tr.LanguageCode, Title = tr.Title, ShortDescription = tr.ShortDescription, FullDescription = tr.FullDescription, WhatToBring = tr.WhatToBring }).ToList(),
                Itineraries = t.Itineraries.OrderBy(i => i.SortOrder).Select(i => new TourItineraryDto { Id = i.Id, TimeSlot = i.TimeSlot, TitleEs = i.TitleEs, TitleEn = i.TitleEn, DescriptionEs = i.DescriptionEs, DescriptionEn = i.DescriptionEn, Icon = i.Icon, SortOrder = i.SortOrder }).ToList(),
                Inclusions = t.Inclusions.OrderBy(i => i.SortOrder).Select(i => new TourInclusionDto { Id = i.Id, TextEs = i.TextEs, TextEn = i.TextEn, IsIncluded = i.IsIncluded, SortOrder = i.SortOrder }).ToList(),
                Images = t.Images.OrderBy(i => i.SortOrder).Select(i => new TourImageDto { Id = i.Id, ImageUrl = i.ImageUrl, AltText = i.AltText, SortOrder = i.SortOrder, IsPrimary = i.IsPrimary }).ToList()
            };
        }
    }
}
