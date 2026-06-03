using System.ComponentModel.DataAnnotations.Schema;

namespace CdfsPalomasAPI.Models;

[Table("dorsales")]
public class Dorsal
{
    public int Id { get; set; }

    [Column("id_jugador")]
    public int IdJugador { get; set; }

    [Column("id_temporada")]
    public int IdTemporada { get; set; }

    [Column("dorsal")]
    public int DorsalNumero { get; set; }

    public Jugador Jugador { get; set; } = null!;
    public Temporada Temporada { get; set; } = null!;
}