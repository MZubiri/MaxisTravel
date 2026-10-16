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
        Task<IEnumerable<TourDto>> GetAllAdminToursAsync();
        Task<TourDto?> GetTourBySlugAsync(string slug, string language = "es");
        Task<Tour?> GetTourByIdAsync(int id);
        Task<TourDto> CreateTourAsync(TourCreateDto dto);
        Task<TourDto?> UpdateTourAsync(int id, TourUpdateDto dto);
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
                .Include(t => t.Translations)
                .Include(t => t.Images)
                .Include(t => t.Itineraries)
                .Include(t => t.Inclusions)
                .AsQueryable();

            if (!string.IsNullOrEmpty(type))
                query = query.Where(t => t.TourType == type);
                
            if (published.HasValue)
                query = query.Where(t => t.IsPublished == published.Value);

            var tours = await query.OrderBy(t => t.SortOrder).ToListAsync();
            
            return tours.Select(t => MapToDto(t, language));
        }

        public async Task<IEnumerable<TourDto>> GetAllAdminToursAsync()
        {
            var tours = await _context.Tours
                .Include(t => t.Translations)
                .Include(t => t.Itineraries)
                .Include(t => t.Inclusions)
                .Include(t => t.Images)
                .OrderBy(t => t.SortOrder)
                .ToListAsync();

            return tours.Select(t => MapToDto(t, "es"));
        }

        public async Task<TourDto?> GetTourBySlugAsync(string slug, string language = "es")
        {
            var tour = await _context.Tours
                .Include(t => t.Translations)
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

        public async Task<TourDto> CreateTourAsync(TourCreateDto dto)
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
                Translations = (dto.Translations ?? new()).Select(tr => new TourTranslation
                {
                    LanguageCode = tr.LanguageCode,
                    Title = tr.Title,
                    ShortDescription = tr.ShortDescription,
                    FullDescription = tr.FullDescription,
                    WhatToBring = tr.WhatToBring ?? string.Empty
                }).ToList(),
                Itineraries = (dto.Itineraries ?? new()).Select(i => new TourItinerary
                {
                    TimeSlot = i.TimeSlot ?? "09:00",
                    TitleEs = i.TitleEs ?? string.Empty,
                    TitleEn = i.TitleEn ?? i.TitleEs ?? string.Empty,
                    DescriptionEs = i.DescriptionEs ?? string.Empty,
                    DescriptionEn = i.DescriptionEn ?? i.DescriptionEs ?? string.Empty,
                    Icon = i.Icon ?? "📍",
                    SortOrder = i.SortOrder
                }).ToList(),
                Inclusions = (dto.Inclusions ?? new()).Select(i => new TourInclusion
                {
                    TextEs = i.TextEs ?? string.Empty,
                    TextEn = i.TextEn ?? i.TextEs ?? string.Empty,
                    IsIncluded = i.IsIncluded,
                    SortOrder = i.SortOrder
                }).ToList(),
                Images = (dto.Images ?? new()).Select(i => new TourImage
                {
                    ImageUrl = i.ImageUrl ?? string.Empty,
                    AltText = i.AltText ?? dto.Slug,
                    SortOrder = i.SortOrder,
                    IsPrimary = i.IsPrimary
                }).ToList()
            };

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();
            return MapToDto(tour, "es");
        }

        public async Task<TourDto?> UpdateTourAsync(int id, TourUpdateDto dto)
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

            // Update translations in place to avoid unique index (TourId, LanguageCode) violations
            var incomingLangCodes = new HashSet<string>();
            if (dto.Translations != null)
            {
                foreach (var trDto in dto.Translations)
                {
                    incomingLangCodes.Add(trDto.LanguageCode);
                    var existing = tour.Translations.FirstOrDefault(t => t.LanguageCode == trDto.LanguageCode);
                    if (existing != null)
                    {
                        existing.Title = trDto.Title;
                        existing.ShortDescription = trDto.ShortDescription;
                        existing.FullDescription = trDto.FullDescription;
                        existing.WhatToBring = trDto.WhatToBring ?? string.Empty;
                    }
                    else
                    {
                        tour.Translations.Add(new TourTranslation
                        {
                            TourId = tour.Id,
                            LanguageCode = trDto.LanguageCode,
                            Title = trDto.Title,
                            ShortDescription = trDto.ShortDescription,
                            FullDescription = trDto.FullDescription,
                            WhatToBring = trDto.WhatToBring ?? string.Empty
                        });
                    }
                }
            }
            var toRemove = tour.Translations.Where(t => !incomingLangCodes.Contains(t.LanguageCode)).ToList();
            foreach (var r in toRemove)
            {
                _context.TourTranslations.Remove(r);
            }

            // Replace itineraries, inclusions, and images safely using navigation collections
            _context.TourItineraries.RemoveRange(tour.Itineraries);
            tour.Itineraries.Clear();
            if (dto.Itineraries != null)
            {
                foreach (var i in dto.Itineraries)
                {
                    tour.Itineraries.Add(new TourItinerary
                    {
                        TourId = tour.Id,
                        TimeSlot = i.TimeSlot ?? "09:00",
                        TitleEs = i.TitleEs ?? string.Empty,
                        TitleEn = i.TitleEn ?? i.TitleEs ?? string.Empty,
                        DescriptionEs = i.DescriptionEs ?? string.Empty,
                        DescriptionEn = i.DescriptionEn ?? i.DescriptionEs ?? string.Empty,
                        Icon = i.Icon ?? "📍",
                        SortOrder = i.SortOrder
                    });
                }
            }

            _context.TourInclusions.RemoveRange(tour.Inclusions);
            tour.Inclusions.Clear();
            if (dto.Inclusions != null)
            {
                foreach (var inc in dto.Inclusions)
                {
                    tour.Inclusions.Add(new TourInclusion
                    {
                        TourId = tour.Id,
                        TextEs = inc.TextEs ?? string.Empty,
                        TextEn = inc.TextEn ?? inc.TextEs ?? string.Empty,
                        IsIncluded = inc.IsIncluded,
                        SortOrder = inc.SortOrder
                    });
                }
            }

            _context.TourImages.RemoveRange(tour.Images);
            tour.Images.Clear();
            if (dto.Images != null)
            {
                foreach (var img in dto.Images)
                {
                    tour.Images.Add(new TourImage
                    {
                        TourId = tour.Id,
                        ImageUrl = img.ImageUrl ?? string.Empty,
                        AltText = img.AltText ?? tour.Slug,
                        SortOrder = img.SortOrder,
                        IsPrimary = img.IsPrimary
                    });
                }
            }

            await _context.SaveChangesAsync();
            return MapToDto(tour, "es");
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
                Id = t.Id,
                Slug = t.Slug,
                Price = t.Price,
                Currency = t.Currency,
                Duration = t.Duration,
                DifficultyLevel = t.DifficultyLevel,
                TourType = t.TourType,
                MaxAltitude = t.MaxAltitude,
                Schedule = t.Schedule,
                Modality = t.Modality,
                IsPublished = t.IsPublished,
                SortOrder = t.SortOrder,
                Translations = (t.Translations ?? new List<TourTranslation>()).Select(tr => new TourTranslationDto
                {
                    Id = tr.Id,
                    LanguageCode = tr.LanguageCode,
                    Title = tr.Title,
                    ShortDescription = tr.ShortDescription,
                    FullDescription = tr.FullDescription,
                    WhatToBring = tr.WhatToBring
                }).ToList(),
                Itineraries = (t.Itineraries ?? new List<TourItinerary>()).OrderBy(i => i.SortOrder).Select(i => new TourItineraryDto
                {
                    Id = i.Id,
                    TimeSlot = i.TimeSlot,
                    TitleEs = i.TitleEs,
                    TitleEn = i.TitleEn,
                    DescriptionEs = i.DescriptionEs,
                    DescriptionEn = i.DescriptionEn,
                    Icon = i.Icon,
                    SortOrder = i.SortOrder
                }).ToList(),
                Inclusions = (t.Inclusions ?? new List<TourInclusion>()).OrderBy(i => i.SortOrder).Select(i => new TourInclusionDto
                {
                    Id = i.Id,
                    TextEs = i.TextEs,
                    TextEn = i.TextEn,
                    IsIncluded = i.IsIncluded,
                    SortOrder = i.SortOrder
                }).ToList(),
                Images = (t.Images ?? new List<TourImage>()).OrderBy(i => i.SortOrder).Select(i => new TourImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    AltText = i.AltText,
                    SortOrder = i.SortOrder,
                    IsPrimary = i.IsPrimary
                }).ToList()
            };
        }
    }
}
