using System.ComponentModel.DataAnnotations.Schema;

namespace CdfsPalomasAPI.Models;
[Table("competiciones")]
public class Competicion
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;
    public string Categoria { get; set; } = "Senior Masculino";

    [Column("id_temporada")]
    public int IdTemporada { get; set; }
    public Temporada Temporada { get; set; } = null!;
    public ICollection<Partido> Partidos { get; set; } = new List<Partido>();
}