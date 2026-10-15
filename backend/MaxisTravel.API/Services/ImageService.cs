using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace MaxisTravel.API.Services
{
    public interface IImageService
    {
        Task<string?> UploadImageAsync(IFormFile file);
        bool DeleteImage(string imageUrl);
    }

    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<ImageService> _logger;

        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif" };
        private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

        public ImageService(IWebHostEnvironment env, ILogger<ImageService> logger)
        {
            _env = env;
            _logger = logger;
        }

        public async Task<string?> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("El archivo de imagen está vacío o no fue proporcionado.");
            }

            if (file.Length > MaxFileSizeBytes)
            {
                throw new ArgumentException($"El archivo excede el tamaño máximo permitido de {MaxFileSizeBytes / (1024 * 1024)} MB.");
            }

            var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
            {
                throw new ArgumentException($"Formato de archivo no permitido ('{extension}'). Solo se aceptan: {string.Join(", ", AllowedExtensions)}");
            }

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            _logger.LogInformation($"Imagen subida exitosamente: {fileName} ({file.Length / 1024} KB)");
            return $"/uploads/{fileName}";
        }

        public bool DeleteImage(string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl)) return false;

            try
            {
                var fileName = Path.GetFileName(imageUrl);
                if (string.IsNullOrEmpty(fileName) || fileName.Contains(".."))
                {
                    return false;
                }

                var filePath = Path.Combine(_env.ContentRootPath, "uploads", fileName);

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    _logger.LogInformation($"Imagen eliminada: {fileName}");
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al eliminar la imagen '{imageUrl}'");
                return false;
            }
        }
    }
}
