using System.ComponentModel.DataAnnotations.Schema;

namespace CdfsPalomasAPI.Models;

[Table("cuerpo_tecnico_asignaciones")]
public class CuerpoTecnicoAsignacion
{
    public int Id { get; set; }

    [Column("id_cuerpo_tecnico")]
    public int IdCuerpoTecnico { get; set; }

    [Column("id_temporada")]
    public int IdTemporada { get; set; }

    public string Categoria { get; set; } = null!;
    public string Cargo { get; set; } = null!;

    public CuerpoTecnico CuerpoTecnico { get; set; } = null!;
    public Temporada Temporada { get; set; } = null!;
}