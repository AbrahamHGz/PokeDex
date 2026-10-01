using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using PokeDex.Server.DTOs;
using System.Text.Json;

namespace PokeDex.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PokemonController : Controller
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private readonly string pokeApi = "https://pokeapi.co/api/v2/";


        [HttpGet]
        public async Task<IActionResult> GetPokemons([FromQuery] int page = 1)
        {
            try
            {
                int limit = 10;
                int offset = (page - 1) * limit;

                string endPoint = $"{pokeApi}pokemon?limit={limit}&offset={offset}";
                HttpResponseMessage response = await httpClient.GetAsync(endPoint);

                if (!response.IsSuccessStatusCode)
                    return NotFound($"No se encontro el listado de pokemones");


                string responseBody = await response.Content.ReadAsStringAsync();

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var apiResponse = JsonSerializer.Deserialize<PokeApiListResponse>(responseBody);

                if (apiResponse?.Results == null)
                    return NotFound("No se encontraron los resultados validos en la API");

                List<PokemonDTO> result = apiResponse.Results.Select(p =>
                {
                    string[] urlSegments = p.Url!.TrimEnd('/').Split('/');
                    string id = urlSegments.Last();

                    return new PokemonDTO
                    {
                        Name = p.Name,
                        Sprite = new SpriteDto
                        {
                            FrontDefault =  $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png"
                        }
                    };
                }).ToList();                

                // Calculo del total de paginas con almenos 10 elementos. Ejemplo: 1000/10 = 100 paginas
                int totalPages = (int)Math.Ceiling((double)apiResponse.Count/limit);
                
                var responseData = new PokemonPaginatedResponse
                {
                    CurrentPage = page,
                    TotalPages = totalPages,
                    Pokemons = result
                };

                return Ok(responseData);
            }
            catch (HttpRequestException ex) {
                return StatusCode(500, $"Error de conexion a la API: {ex.Message}");
            }
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetPokemon(string name)
        {
            try
            {

                string endPoint = $"{pokeApi}pokemon?limit=150&offset=0";
                HttpResponseMessage response = await httpClient.GetAsync(endPoint);

                if (!response.IsSuccessStatusCode)
                    return NotFound($"No se encontro el listado de pokemones");




                return Ok();
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Error de conexion a la API: {ex.Message}");
            }
        }

    }
}
