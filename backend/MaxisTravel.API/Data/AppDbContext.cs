using MaxisTravel.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MaxisTravel.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tour> Tours { get; set; }
        public DbSet<TourTranslation> TourTranslations { get; set; }
        public DbSet<TourItinerary> TourItineraries { get; set; }
        public DbSet<TourInclusion> TourInclusions { get; set; }
        public DbSet<TourImage> TourImages { get; set; }
        public DbSet<SiteSettings> SiteSettings { get; set; }
        public DbSet<ColorPalette> ColorPalettes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TourTranslation>()
                .HasIndex(t => new { t.TourId, t.LanguageCode })
                .IsUnique();
            
            modelBuilder.Entity<SiteSettings>()
                .HasIndex(s => s.SettingKey)
                .IsUnique();

            modelBuilder.Entity<Language>()
                .HasKey(l => l.Code);

            modelBuilder.Entity<Tour>()
                .HasIndex(t => t.Slug)
                .IsUnique();
        }
    }
}
