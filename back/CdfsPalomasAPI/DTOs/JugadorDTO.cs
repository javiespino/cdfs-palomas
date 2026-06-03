namespace CdfsPalomasAPI.DTOs;
public class JugadorDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;
    public string Apellidos { get; set; } = null!;
    public string? Posicion { get; set; }
    public string? Foto { get; set; }
    public bool Activo { get; set; }
    public int? Dorsal { get; set; }
}
public class CrearJugadorDto
{
    public string Nombre { get; set; } = null!;
    public string Apellidos { get; set; } = null!;
    public string? Posicion { get; set; }
    public bool Activo { get; set; } = true;
}