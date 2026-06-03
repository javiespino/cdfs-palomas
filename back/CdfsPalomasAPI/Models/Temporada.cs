namespace CdfsPalomasAPI.Models;

public class Temporada
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;

    public ICollection<Competicion> Competiciones { get; set; } = new List<Competicion>();
}