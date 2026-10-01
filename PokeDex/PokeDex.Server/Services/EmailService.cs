using System.Net;
using System.Net.Mail;
using System.Text;
using PokeDex.Server.DTOs;

namespace PokeDex.Server.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        // Inyectamos IConfiguration en el constructor
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task EnviarPokemonsPorCorreoAsync(string correosDestino, List<PokemonDTO> pokemons)
        {
            // Configuramos el correo de origen (Ejemplo con Gmail)
            // IMPORTANTE: Si usas Gmail, no pongas tu contraseña normal. 
            // Debes ir a tu cuenta de Google > Seguridad > "Contraseñas de aplicaciones" y generar una.
            // Las credenciales se configuran en el appsettings.json
            string miCorreo = _configuration["EmailSettings:SenderEmail"] 
                              ?? throw new ArgumentNullException("SenderEmail no está configurado.");
            string miPasswordApp = _configuration["EmailSettings:SenderPassword"] 
                                   ?? throw new ArgumentNullException("SenderPassword no está configurado.");

            var mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(miCorreo, "Pokédex App");
            
            
            var listaCorreos = correosDestino.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var correo in listaCorreos)
            {
                mailMessage.To.Add(correo.Trim());
            }

            mailMessage.Subject = "Tus resultados de la Pokédex";
            mailMessage.IsBodyHtml = true;

            // Construimos el cuerpo del correo en HTML
            var htmlBuilder = new StringBuilder();
            htmlBuilder.Append(@"
                <h2 style='color: #E53E3E;'>Lista de Pokémon Solicitada</h2>
                <table border='1' cellpadding='10' style='border-collapse: collapse; text-align: center; font-family: Arial;'>
                    <tr style='background-color: #f3f4f6;'>
                        <th>Nombre</th>
                        <th>Sprite</th>
                    </tr>");

            foreach (var p in pokemons)
            {
                string nombre = char.ToUpper(p.Name![0]) + p.Name.Substring(1);
                // Insertamos la imagen directamente de la URL
                htmlBuilder.Append($@"
                    <tr>
                        <td style='text-transform: capitalize; font-weight: bold;'>{nombre}</td>
                        <td><img src='{p.Sprite?.FrontDefault}' alt='{nombre}' width='96' height='96' /></td>
                    </tr>");
            }
            htmlBuilder.Append("</table><p>Enviado desde tu aplicación Pokédex con ASP.NET Core y React.</p>");

            mailMessage.Body = htmlBuilder.ToString();

            // Configuramos el cliente SMTP y enviamos
            using var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(miCorreo, miPasswordApp),
                EnableSsl = true,
            };

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}