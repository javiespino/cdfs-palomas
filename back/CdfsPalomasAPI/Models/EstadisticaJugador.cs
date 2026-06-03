using System.ComponentModel.DataAnnotations.Schema;

namespace CdfsPalomasAPI.Models;

[Table("estadisticas_jugador")]
public class EstadisticaJugador
{
    public int Id { get; set; }

    [Column("id_jugador")]
    public int IdJugador { get; set; }

    [Column("id_competicion")]
    public int IdCompeticion { get; set; }
    public int Dorsal { get; set; }
    public int Jugados { get; set; }
    public int Titular { get; set; }
    public int Goles { get; set; }
    public int Amarillas { get; set; }

    [Column("doble_amarilla")]
    public int DobleAmarilla { get; set; }
    public int Rojas { get; set; }
    public Jugador Jugador { get; set; } = null!;
    public Competicion Competicion { get; set; } = null!;
}