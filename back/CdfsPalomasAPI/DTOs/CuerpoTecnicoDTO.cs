namespace CdfsPalomasAPI.DTOs;

public class CuerpoTecnicoDto
{
    public string Nombre { get; set; } = null!;
    public string Apellidos { get; set; } = null!;
}

public class CuerpoTecnicoAsignacionDto
{
    public int Id { get; set; }
    public int IdCuerpoTecnico { get; set; }
    public string NombreCompleto { get; set; } = null!;
    public string? Foto { get; set; }
    public int IdTemporada { get; set; }
    public string NombreTemporada { get; set; } = null!;
    public string Categoria { get; set; } = null!;
    public string Cargo { get; set; } = null!;
}

public class CrearAsignacionDto
{
    public int IdCuerpoTecnico { get; set; }
    public int IdTemporada { get; set; }
    public string Categoria { get; set; } = null!;
    public string Cargo { get; set; } = null!;
}