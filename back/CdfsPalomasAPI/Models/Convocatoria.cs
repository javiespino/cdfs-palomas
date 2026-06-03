using System.ComponentModel.DataAnnotations.Schema;
namespace CdfsPalomasAPI.Models;

[Table("convocatorias")]
public class Convocatoria
{
    public int Id { get; set; }

    [Column("id_partido")]
    public int IdPartido { get; set; }

    [Column("id_jugador")]
    public int IdJugador { get; set; }

    public bool Titular { get; set; } = false;
    public int Goles { get; set; } = 0;
    public int Amarillas { get; set; } = 0;

    [Column("doble_amarilla")]
    public bool DobleAmarilla { get; set; } = false;
    public bool Roja { get; set; } = false;

    public Partido Partido { get; set; } = null!;
    public Jugador Jugador { get; set; } = null!;
}