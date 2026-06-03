namespace CdfsPalomasAPI.DTOs;

public class TemporadaDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;
}

public class CompeticionDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;
    public string Categoria { get; set; } = null!;
    public int IdTemporada { get; set; }
    public string NombreTemporada { get; set; } = null!;
}

public class CrearCompeticionDto
{
    public string Nombre { get; set; } = null!;
    public string Categoria { get; set; } = null!;
    public int IdTemporada { get; set; }
}