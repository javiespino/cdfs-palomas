using System.ComponentModel.DataAnnotations.Schema;

namespace CdfsPalomasAPI.Models;

[Table("cuerpo_tecnico")]
public class CuerpoTecnico
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;
    public string Apellidos { get; set; } = null!;
    public string? Foto { get; set; }
    public ICollection<CuerpoTecnicoAsignacion> Asignaciones { get; set; } = new List<CuerpoTecnicoAsignacion>();
}