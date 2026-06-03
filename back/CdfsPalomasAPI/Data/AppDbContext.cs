using CdfsPalomasAPI.Models;
using Microsoft.EntityFrameworkCore;
namespace CdfsPalomasAPI.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Usuario> Usuarios { get; set; } = null!;
    public DbSet<Jugador> Jugadores { get; set; } = null!;
    public DbSet<Temporada> Temporadas { get; set; } = null!;
    public DbSet<Competicion> Competiciones { get; set; } = null!;
    public DbSet<Partido> Partidos { get; set; } = null!;
    public DbSet<Convocatoria> Convocatorias { get; set; } = null!;
    public DbSet<Noticia> Noticias { get; set; } = null!;
    public DbSet<Galeria> Galerias { get; set; } = null!;
    public DbSet<CuerpoTecnico> CuerpoTecnico { get; set; } = null!;
    public DbSet<CuerpoTecnicoAsignacion> CuerpoTecnicoAsignaciones { get; set; } = null!;
    public DbSet<Dorsal> Dorsales { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Convocatoria>()
            .HasIndex(c => new { c.IdPartido, c.IdJugador }).IsUnique();
        modelBuilder.Entity<Convocatoria>()
            .HasOne(c => c.Partido)
            .WithMany(p => p.Convocatorias)
            .HasForeignKey(c => c.IdPartido);
        modelBuilder.Entity<Convocatoria>()
            .HasOne(c => c.Jugador)
            .WithMany(j => j.Convocatorias)
            .HasForeignKey(c => c.IdJugador);
        modelBuilder.Entity<Partido>()
            .HasOne(p => p.Competicion)
            .WithMany(c => c.Partidos)
            .HasForeignKey(p => p.IdCompeticion);
        modelBuilder.Entity<Competicion>()
            .HasOne(c => c.Temporada)
            .WithMany(t => t.Competiciones)
            .HasForeignKey(c => c.IdTemporada);
        modelBuilder.Entity<Noticia>()
            .HasOne(n => n.Usuario)
            .WithMany()
            .HasForeignKey(n => n.IdUsuario)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Galeria>()
            .HasOne(g => g.Partido)
            .WithMany(p => p.Galerias)
            .HasForeignKey(g => g.IdPartido)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<CuerpoTecnicoAsignacion>()
            .HasOne(a => a.CuerpoTecnico)
            .WithMany(c => c.Asignaciones)
            .HasForeignKey(a => a.IdCuerpoTecnico);
        modelBuilder.Entity<CuerpoTecnicoAsignacion>()
            .HasOne(a => a.Temporada)
            .WithMany()
            .HasForeignKey(a => a.IdTemporada);
        modelBuilder.Entity<Dorsal>()
            .HasIndex(d => new { d.IdJugador, d.IdTemporada }).IsUnique();
        modelBuilder.Entity<Dorsal>()
            .HasOne(d => d.Jugador)
            .WithMany()
            .HasForeignKey(d => d.IdJugador);
        modelBuilder.Entity<Dorsal>()
            .HasOne(d => d.Temporada)
            .WithMany()
            .HasForeignKey(d => d.IdTemporada);
    }
}