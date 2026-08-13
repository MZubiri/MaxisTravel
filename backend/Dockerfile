# ================================
# Stage 1: Build
# ================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY MaxisTravel.API/MaxisTravel.API.csproj MaxisTravel.API/
RUN dotnet restore MaxisTravel.API/MaxisTravel.API.csproj

# Copy source and build
COPY MaxisTravel.API/ MaxisTravel.API/
WORKDIR /src/MaxisTravel.API
RUN dotnet publish -c Release -o /app/publish --no-restore

# ================================
# Stage 2: Runtime
# ================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy published output
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/api/health || exit 1

ENTRYPOINT ["dotnet", "MaxisTravel.API.dll"]
