namespace CdfsPalomasAPI.Models;

public class Jugador
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;
    public string Apellidos { get; set; } = null!;
    public string? Posicion { get; set; }
    public string? Foto { get; set; }
    public bool Activo { get; set; } = true;

    public ICollection<Convocatoria> Convocatorias { get; set; } = new List<Convocatoria>();
}