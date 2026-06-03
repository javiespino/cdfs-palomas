using System.ComponentModel.DataAnnotations.Schema;

namespace CdfsPalomasAPI.Models;
[Table("partidos")]
public class Partido
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public string Rival { get; set; } = null!;

    [Column("goles_favor")]
    public int GolesFavor { get; set; } = 0;

    [Column("goles_contra")]
    public int GolesContra { get; set; } = 0;

    [Column("es_local")]
    public bool EsLocal { get; set; } = true;

    [Column("id_competicion")]
    public int IdCompeticion { get; set; }
    public bool Jugado { get; set; } = false;
    public Competicion Competicion { get; set; } = null!;
    public ICollection<Convocatoria> Convocatorias { get; set; } = new List<Convocatoria>();
    public ICollection<Galeria> Galerias { get; set; } = new List<Galeria>();
}