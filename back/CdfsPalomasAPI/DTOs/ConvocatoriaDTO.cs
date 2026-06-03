namespace CdfsPalomasAPI.DTOs;

public class ConvocatoriaDto
{
    public int Id { get; set; }
    public int IdJugador { get; set; }
    public string NombreJugador { get; set; } = null!;
    public string ApellidosJugador { get; set; } = null!;
    public string? FotoJugador { get; set; }
    public bool Titular { get; set; }
    public int Goles { get; set; }
    public int Amarillas { get; set; }
    public bool DobleAmarilla { get; set; }
    public bool Roja { get; set; }
}

public class CrearConvocatoriaDto
{
    public int IdJugador { get; set; }
}

public class ActualizarEstadisticasDto
{
    public int IdConvocatoria { get; set; }
    public bool Titular { get; set; }
    public int Goles { get; set; }
    public int Amarillas { get; set; }
    public bool DobleAmarilla { get; set; }
    public bool Roja { get; set; }
}