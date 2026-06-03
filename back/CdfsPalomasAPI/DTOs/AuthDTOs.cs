namespace CdfsPalomasAPI.DTOs;

public class LoginDto
{
	public string Email { get; set; } = null!;
	public string Contrasena { get; set; } = null!;
}

public class LoginResponseDto
{
	public string Token { get; set; } = null!;
	public string Nombre { get; set; } = null!;
	public string Rol { get; set; } = null!;
}