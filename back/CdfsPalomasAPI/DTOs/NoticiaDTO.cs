namespace CdfsPalomasAPI.DTOs;

public class NoticiaDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = null!;
    public string Contenido { get; set; } = null!;
    public string? Imagen { get; set; }
    public int IdUsuario { get; set; }
    public string NombreUsuario { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

public class CrearNoticiaDto
{
    public string Titulo { get; set; } = null!;
    public string Contenido { get; set; } = null!;
}