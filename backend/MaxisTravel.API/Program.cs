using System.IO;
using System.Text;
using MaxisTravel.API.Data;
using MaxisTravel.API.Data.Seed;
using MaxisTravel.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// DbContext configuration (MySQL in Docker/Prod, SQLite fallback for local testing)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (!string.IsNullOrEmpty(connectionString) && (connectionString.Contains("Server=") || connectionString.Contains("Port=")))
    {
        try
        {
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        }
        catch
        {
            options.UseSqlite("Data Source=maxis_travel_local.db");
        }
    }
    else
    {
        options.UseSqlite("Data Source=maxis_travel_local.db");
    }
});

// Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITourService, TourService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<IImageService, ImageService>();
builder.Services.AddHttpClient<IMercadoPagoService, MercadoPagoService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "MaxisTravel API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Ejemplo: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// JWT Authentication
var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? "SuperSecretKeyThatIsAtLeast32BytesLong!";
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "MaxisTravelAPI",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"] ?? "MaxisTravelApp",
            ValidateLifetime = true
        };
    });

var app = builder.Build();

// Auto-migrate and seed
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    try
    {
        await context.Database.ExecuteSqlRawAsync(@"
            CREATE TABLE IF NOT EXISTS `Bookings` (
                `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                `TourId` VARCHAR(100) NOT NULL,
                `TourName` VARCHAR(255) NOT NULL,
                `CustomerName` VARCHAR(255) NOT NULL,
                `CustomerEmail` VARCHAR(255) NOT NULL,
                `CustomerPhone` VARCHAR(50) NOT NULL,
                `TravelDate` VARCHAR(50) NOT NULL,
                `Passengers` INT NOT NULL DEFAULT 1,
                `TotalAmount` DECIMAL(18, 2) NOT NULL,
                `Currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
                `PreferenceId` VARCHAR(255) NOT NULL,
                `PaymentId` VARCHAR(100) NULL,
                `Status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
                `PaymentMethod` VARCHAR(100) NULL,
                `ExternalReference` VARCHAR(255) NULL,
                `CreatedAt` DATETIME(6) NOT NULL,
                `UpdatedAt` DATETIME(6) NULL
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    }
    catch
    {
        try
        {
            await context.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS Bookings (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    TourId TEXT NOT NULL,
                    TourName TEXT NOT NULL,
                    CustomerName TEXT NOT NULL,
                    CustomerEmail TEXT NOT NULL,
                    CustomerPhone TEXT NOT NULL,
                    TravelDate TEXT NOT NULL,
                    Passengers INTEGER NOT NULL,
                    TotalAmount TEXT NOT NULL,
                    Currency TEXT NOT NULL,
                    PreferenceId TEXT NOT NULL,
                    PaymentId TEXT NULL,
                    Status TEXT NOT NULL,
                    PaymentMethod TEXT NULL,
                    ExternalReference TEXT NULL,
                    CreatedAt TEXT NOT NULL,
                    UpdatedAt TEXT NULL
                );");
        }
        catch { }
    }

    await DataSeeder.SeedAsync(context);
}

// Ensure Uploads folder exists
var uploadsFolder = Path.Combine(app.Environment.ContentRootPath, "uploads");
if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsFolder),
    RequestPath = "/uploads"
});

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

// Health check endpoint for Docker
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();
