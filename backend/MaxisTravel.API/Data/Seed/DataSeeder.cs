using System.Linq;
using System.Threading.Tasks;
using MaxisTravel.API.Models;

namespace MaxisTravel.API.Data.Seed
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Seed Languages
            if (!context.Languages.Any())
            {
                context.Languages.AddRange(
                    new Language { Code = "es", Name = "Español", NativeName = "Español", FlagEmoji = "🇪🇸", IsActive = true, SortOrder = 1 },
                    new Language { Code = "en", Name = "Inglés", NativeName = "English", FlagEmoji = "🇺🇸", IsActive = true, SortOrder = 2 },
                    new Language { Code = "fr", Name = "Francés", NativeName = "Français", FlagEmoji = "🇫🇷", IsActive = true, SortOrder = 3 },
                    new Language { Code = "pt", Name = "Portugués", NativeName = "Português", FlagEmoji = "🇧🇷", IsActive = true, SortOrder = 4 },
                    new Language { Code = "de", Name = "Alemán", NativeName = "Deutsch", FlagEmoji = "🇩🇪", IsActive = true, SortOrder = 5 },
                    new Language { Code = "it", Name = "Italiano", NativeName = "Italiano", FlagEmoji = "🇮🇹", IsActive = true, SortOrder = 6 },
                    new Language { Code = "ja", Name = "Japonés", NativeName = "日本語", FlagEmoji = "🇯🇵", IsActive = true, SortOrder = 7 },
                    new Language { Code = "zh", Name = "Chino", NativeName = "中文", FlagEmoji = "🇨🇳", IsActive = true, SortOrder = 8 },
                    new Language { Code = "ko", Name = "Coreano", NativeName = "한국어", FlagEmoji = "🇰🇷", IsActive = true, SortOrder = 9 }
                );
            }

            // Seed Admin User
            if (!context.Users.Any())
            {
                context.Users.Add(new User
                {
                    Username = "admin",
                    Email = "admin@maxistravel.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("MaxisTravel2024!"),
                    FullName = "Administrador",
                    Role = "Admin"
                });
            }

            // Seed Color Palettes
            if (!context.ColorPalettes.Any())
            {
                context.ColorPalettes.AddRange(
                    new ColorPalette { Name = "Hera", IsActive = true, PrimaryColor = "#C97F6C", SecondaryColor = "#C26148", AccentColor = "#D6AA5C", LightColor = "#EDDEE0", DarkColor = "#3D2B1F", BackgroundColor = "#FFF8F5" },
                    new ColorPalette { Name = "Perséfone", IsActive = false, PrimaryColor = "#04474B", SecondaryColor = "#D3B9B9", AccentColor = "#E4981E", LightColor = "#E7E7E5", DarkColor = "#022D30", BackgroundColor = "#FAFAF8" }
                );
            }

            // Seed Site Settings
            if (!context.SiteSettings.Any())
            {
                context.SiteSettings.AddRange(
                    new SiteSettings { SettingKey = "whatsapp_number", SettingValue = "+51948735614" },
                    new SiteSettings { SettingKey = "brand_name", SettingValue = "MaxisTravel" },
                    new SiteSettings { SettingKey = "tagline", SettingValue = "Transporte & Turismo" }
                );
            }

            // Seed Tours
            if (!context.Tours.Any())
            {
                var cityTour = new Tour
                {
                    Slug = "city-tour-cusco", Price = 20m, Duration = "4 horas", DifficultyLevel = "Fácil", TourType = "Cultural", MaxAltitude = "3,600 m", Schedule = "9:00 a.m. y 1:00 p.m.", Modality = "Tour compartido", IsPublished = true, SortOrder = 1
                };
                context.Tours.Add(cityTour);
                
                var montana7Colores = new Tour
                {
                    Slug = "montana-7-colores-vinicunca", Price = 40m, Duration = "Full Day", DifficultyLevel = "Moderada a Exigente", TourType = "Aventura", MaxAltitude = "5,100 m", Schedule = "4:30 a.m. - 5:00 p.m.", Modality = "Tour compartido", IsPublished = true, SortOrder = 2
                };
                context.Tours.Add(montana7Colores);

                var humantay = new Tour
                {
                    Slug = "laguna-humantay", Price = 40m, Duration = "Full Day", DifficultyLevel = "Moderada a Exigente", TourType = "Naturaleza", MaxAltitude = "4,200 m", Schedule = "4:30 a.m. - 5:30 p.m.", Modality = "Tour compartido", IsPublished = true, SortOrder = 3
                };
                context.Tours.Add(humantay);

                var valleSagrado = new Tour
                {
                    Slug = "valle-sagrado-incas", Price = 50m, Duration = "Full Day", DifficultyLevel = "Moderada", TourType = "Cultural", MaxAltitude = "3,762 m", Schedule = "8:00 a.m. - 7:00 p.m.", Modality = "Tour compartido", IsPublished = true, SortOrder = 4
                };
                context.Tours.Add(valleSagrado);

                var barroco = new Tour
                {
                    Slug = "tour-barroco-andino", Price = 55m, Duration = "1 Día", DifficultyLevel = "Fácil", TourType = "Cultural", MaxAltitude = "3,200 m", Schedule = "8:30 a.m. - 3:00 p.m.", Modality = "Tour privado", IsPublished = true, SortOrder = 5
                };
                context.Tours.Add(barroco);

                await context.SaveChangesAsync();

                // Simple translations
                context.TourTranslations.AddRange(
                    new TourTranslation { TourId = cityTour.Id, LanguageCode = "es", Title = "City Tour Cusco – Medio Día", ShortDescription = "Visita los principales centros arqueológicos de Cusco.", FullDescription = "Visita Sacsayhuamán, Qenqo, Puka Pukara, Tambomachay y Qoricancha.", WhatToBring = "Agua, bloqueador, sombrero." },
                    new TourTranslation { TourId = cityTour.Id, LanguageCode = "en", Title = "Cusco City Tour – Half Day", ShortDescription = "Visit the main archeological centers in Cusco.", FullDescription = "Visit Sacsayhuamán, Qenqo, Puka Pukara, Tambomachay, and Qoricancha.", WhatToBring = "Water, sun block, hat." },
                    
                    new TourTranslation { TourId = montana7Colores.Id, LanguageCode = "es", Title = "Montaña de 7 Colores – Vinicunca", ShortDescription = "Aventura hacia la mágica Montaña de Siete Colores.", FullDescription = "Destacados: Montaña Arcoíris, glaciar Ausangate, llamas, alpacas.", WhatToBring = "Ropa abrigadora, zapatos de trekking." },
                    new TourTranslation { TourId = montana7Colores.Id, LanguageCode = "en", Title = "Rainbow Mountain – Vinicunca", ShortDescription = "Adventure to the magical Seven Color Mountain.", FullDescription = "Highlights: Rainbow Mountain, Ausangate glacier, llamas, alpacas.", WhatToBring = "Warm clothes, trekking shoes." },

                    new TourTranslation { TourId = humantay.Id, LanguageCode = "es", Title = "Laguna Humantay – Full Day", ShortDescription = "Maravíllate con la laguna turquesa en los Andes.", FullDescription = "Laguna turquesa y el glaciar Humantay.", WhatToBring = "Ropa abrigadora, zapatos cómodos." },
                    new TourTranslation { TourId = humantay.Id, LanguageCode = "en", Title = "Humantay Lake – Full Day", ShortDescription = "Marvel at the turquoise lake in the Andes.", FullDescription = "Turquoise lake and Humantay glacier.", WhatToBring = "Warm clothes, comfortable shoes." },

                    new TourTranslation { TourId = valleSagrado.Id, LanguageCode = "es", Title = "Valle Sagrado de los Incas – Full Day", ShortDescription = "Descubre la historia en el Valle Sagrado.", FullDescription = "Visitas: Chinchero, Moray, Salineras de Maras, Ollantaytambo, Pisac.", WhatToBring = "Bloqueador, cámara." },
                    new TourTranslation { TourId = valleSagrado.Id, LanguageCode = "en", Title = "Sacred Valley of the Incas – Full Day", ShortDescription = "Discover the history in the Sacred Valley.", FullDescription = "Visits: Chinchero, Moray, Maras Salt Mines, Ollantaytambo, Pisac.", WhatToBring = "Sun block, camera." },

                    new TourTranslation { TourId = barroco.Id, LanguageCode = "es", Title = "Tour Barroco Andino – 1 Día", ShortDescription = "Recorrido cultural por el sur de Cusco.", FullDescription = "Visitas: Templo Compañía de Jesús, Andahuaylillas, Huaro, Canincunca.", WhatToBring = "Agua, dinero extra." },
                    new TourTranslation { TourId = barroco.Id, LanguageCode = "en", Title = "Andean Baroque Tour – 1 Day", ShortDescription = "Cultural tour through the south of Cusco.", FullDescription = "Visits: Templo Compañía de Jesús, Andahuaylillas, Huaro, Canincunca.", WhatToBring = "Water, extra cash." }
                );

                await context.SaveChangesAsync();
            }
        }
    }
}
