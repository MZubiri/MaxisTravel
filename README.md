# 🏔️ MaxisTravel - Transporte & Turismo

> Sitio web de turismo para la agencia MaxisTravel en Cusco, Perú.

![MaxisTravel Logo](frontend/src/assets/images/logo.jpeg)

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|------------|-----------|
| Frontend | Angular 18 |
| Backend API | ASP.NET Core 8 |
| Base de Datos | MySQL 8.0 |
| Contenedores | Docker + Docker Compose |
| Web Server | Nginx |
| Autenticación | JWT |

## 🚀 Inicio Rápido

### Requisitos
- Docker & Docker Compose

### Despliegue con Docker

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/TurismoCusco.git
cd TurismoCusco

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Levantar todos los servicios
docker-compose up -d --build

# 4. Acceder al sitio
# Frontend: http://localhost:80
# API: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

### Desarrollo Local

#### Backend
```bash
cd backend/MaxisTravel.API
dotnet run
# API disponible en http://localhost:5000
```

#### Frontend
```bash
cd frontend
npm install
ng serve
# App disponible en http://localhost:4200
```

## 📋 Funcionalidades

### Sitio Público
- 🏠 Página de inicio con hero, tours destacados, galería y testimonios
- 🗺️ Catálogo de tours con filtros
- 📋 Detalle de tour con itinerario, inclusiones y galería
- 🏛️ Página "Sobre Nosotros"
- 📞 Formulario de contacto con integración WhatsApp
- 🌐 Multi-idioma (9 idiomas)
- 📱 Diseño responsive mobile-first
- 💬 Botón flotante de WhatsApp

### Panel Administrativo (`/admin`)
- 📊 Dashboard con estadísticas
- ✏️ CRUD completo de tours
- 🎨 Selector de paleta de colores (Hera / Perséfone)
- 🖼️ Gestión de galería de fotos
- 💌 Bandeja de mensajes de contacto
- 🌐 Gestión de traducciones
- ⚙️ Configuración general

### Credenciales Admin por defecto
- **Usuario:** admin
- **Contraseña:** MaxisTravel2024!

## 🎨 Paletas de Colores

### Hera (Cálida)
`#C97F6C` `#C26148` `#D6AA5C` `#EDDEE0` `#3D2B1F`

### Perséfone (Fría)
`#04474B` `#D3B9B9` `#E4981E` `#E7E7E5` `#022D30`

## 🗺️ Tours Disponibles

| Tour | Precio | Duración |
|------|--------|----------|
| City Tour Cusco | US$20 | 4 horas |
| Montaña de 7 Colores | US$40 | Full Day |
| Laguna Humantay | US$40 | Full Day |
| Valle Sagrado | US$50 | ~12 horas |
| Tour Barroco Andino | US$55 | 1 día |

## 📁 Estructura del Proyecto

```
TurismoCusco/
├── backend/          # ASP.NET Core 8 Web API
├── frontend/         # Angular 18 SPA
├── database/         # Scripts SQL
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚢 Deploy con Coolify

1. Conectar el repositorio GitHub en Coolify
2. Seleccionar "Docker Compose" como tipo de despliegue
3. Configurar las variables de entorno desde `.env.example`
4. Deploy automático en cada push a `main`

## 📄 Licencia

© 2024 MaxisTravel - Transporte & Turismo. Todos los derechos reservados.
