using System.ComponentModel.DataAnnotations.Schema;

namespace CdfsPalomasAPI.Models;
[Table("galeria")]
public class Galeria
{
    public int Id { get; set; }

    [Column("url_imagen")]
    public string UrlImagen { get; set; } = null!;

    [Column("descripoion")]
    public string? Descripcion { get; set; }
    public DateTime? Fecha { get; set; }

    [Column("id_partido")]
    public int? IdPartido { get; set; }
    public Partido? Partido { get; set; }
}