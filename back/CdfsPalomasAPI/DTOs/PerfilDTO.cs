namespace CdfsPalomasAPI.DTOs;

public class ActualizarPerfilDto
{
    public string Nombre { get; set; } = null!;
    public string Email { get; set; } = null!;
}

public class CambiarContrasenaDto
{
    public string ContrasenaActual { get; set; } = null!;
    public string NuevaContrasena { get; set; } = null!;
}