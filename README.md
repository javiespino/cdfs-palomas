# CDFS Palomas — Aplicación Web

Aplicación web completa para la gestión del **Club Deportivo Fútbol Sala Palomas** (Palomas, Extremadura).

---

## 📋 Descripción

Plataforma digital que permite a los aficionados del club seguir la actividad del equipo y a los administradores gestionar toda la información del club desde un panel de control protegido.

**Parte pública:**
- Página de inicio con noticias destacadas y próximos partidos
- Plantilla de jugadores filtrable por temporada, categoría y posición
- Calendario de partidos con detalle de convocatorias y estadísticas
- Resumen de temporada con clasificación y jugadores destacados
- Estadísticas históricas por categoría y competición
- Noticias del club
- Historia del club y localización del pabellón con Google Maps

**Panel de administración (protegido con JWT):**
- Gestión de jugadores con asignación de dorsales por temporada
- Gestión de partidos, convocatorias y estadísticas individuales
- Gestión de temporadas y competiciones
- Gestión de noticias con soporte de pegado de imágenes
- Gestión del cuerpo técnico con asignaciones por temporada y categoría
- Perfil del administrador

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 20 (standalone, signals, zoneless) |
| Backend | ASP.NET Core 6, Entity Framework Core 6 |
| Base de datos | SQL Server / Azure SQL Database |
| Autenticación | JWT + BCrypt |
| Despliegue | Microsoft Azure (App Service + Static Web Apps) |
| Dominio | IONOS → cdfspalomas.es |

---

## 📁 Estructura del repositorio

```
cdfs-palomas/
├── front/          # Proyecto Angular 20 (frontend)
├── back/           # Proyecto ASP.NET Core 6 (API REST)
└── bbdd/           # Script SQL del esquema de la base de datos
```

---

## 🚀 Instalación y ejecución en local

### Requisitos previos

- Node.js 22.x
- Angular CLI 21.x (`npm install -g @angular/cli`)
- .NET SDK 6.0
- SQL Server (local o Express)
- Visual Studio 2022

### Base de datos

1. Abre SQL Server Management Studio
2. Ejecuta el script `bbdd/schema.sql` para crear la base de datos y las tablas

### Backend (API)

1. Abre `back/CdfsPalomasAPI.sln` con Visual Studio 2022
2. Configura `appsettings.json` con tu cadena de conexión:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=cdfs_palomas;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "TU_CLAVE_SECRETA_MINIMO_32_CARACTERES",
    "Issuer": "CdfsPalomasAPI",
    "Audience": "CdfsPalomasApp"
  }
}
```

3. Ejecuta la API con `F5` o `dotnet run`. La API arrancará en `http://localhost:5013`
4. Swagger disponible en `http://localhost:5013/index.html`

### Frontend (Angular)

1. Entra en la carpeta `front`:

```bash
cd front
npm install
```

2. Comprueba que `src/enviroment/enviroment.development.ts` apunta a tu API local:

```typescript
export const environment = {
  apiUrl: 'http://localhost:5013/api',
  mediaUrl: 'http://localhost:5013'
};
```

3. Arranca el servidor de desarrollo:

```bash
ng serve
```

4. Abre el navegador en `http://localhost:4200`

---

## ☁️ Despliegue en producción

| Recurso | Servicio | URL |
|---------|---------|-----|
| Frontend | Azure Static Web Apps | cdfspalomas.es |
| API | Azure App Service | cdfs-palomas-api-h9g5b4d6azf3gbdr.westeurope-01.azurewebsites.net |
| Base de datos | Azure SQL Database | cdfs-palomas-server.database.windows.net |

El despliegue del frontend se realiza automáticamente mediante GitHub Actions al hacer push a la rama `master`.

Para redesplegar la API: clic derecho sobre el proyecto en Visual Studio → **Publicar**.

---

## 🗄️ Base de datos

El esquema completo de la base de datos está en `bbdd/schema.sql`. Las tablas principales son:

| Tabla | Descripción |
|-------|------------|
| `usuarios` | Credenciales y datos de los administradores |
| `jugadores` | Datos de los jugadores del club |
| `temporadas` | Temporadas del club |
| `competiciones` | Competiciones por temporada y categoría |
| `partidos` | Partidos con fecha, rival y resultado |
| `convocatorias` | Jugadores por partido con estadísticas individuales |
| `dorsales` | Dorsal de cada jugador por temporada |
| `noticias` | Noticias publicadas |
| `cuerpo_tecnico` | Miembros del cuerpo técnico |
| `cuerpo_tecnico_asignaciones` | Cargos por temporada y categoría |

---

## 🔐 Seguridad

- Autenticación mediante **JWT** con caducidad de 8 horas
- Contraseñas cifradas con **BCrypt**
- Token almacenado en **sessionStorage** (se elimina al cerrar el navegador)
- Rutas del panel admin protegidas con **AuthGuard**
- CORS configurado para aceptar solo orígenes autorizados

---

## 👨‍💻 Autor

**Javier Espino**
Trabajo de Fin de Grado — Grado Superior DAM
IES Arroyo Harnina — Curso 2025/2026
