namespace CdfsPalomasAPI.DTOs;

public class PartidoDto
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public string Rival { get; set; } = null!;
    public int GolesFavor { get; set; }
    public int GolesContra { get; set; }
    public bool EsLocal { get; set; }
    public int IdCompeticion { get; set; }
    public string NombreCompeticion { get; set; } = null!;
    public string Categoria { get; set; } = null!;
    public string NombreTemporada { get; set; } = null!;
    public bool Jugado { get; set; }
}

public class CrearPartidoDto
{
    public DateTime Fecha { get; set; }
    public string Rival { get; set; } = null!;
    public int GolesFavor { get; set; }
    public int GolesContra { get; set; }
    public bool EsLocal { get; set; } = true;
    public int IdCompeticion { get; set; }
    public bool Jugado { get; set; }
}