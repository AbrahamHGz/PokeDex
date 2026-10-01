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

        //EndPoint de Listados

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

        //EndPoint por filtro de nombre
        [HttpGet("{name}")]
        public async Task<IActionResult> GetPokemonByName(string name)
        {
            try
            {

                string endPoint = $"{pokeApi}pokemon/{name.ToLower().Trim()}";
                HttpResponseMessage response = await httpClient.GetAsync(endPoint);

                if (!response.IsSuccessStatusCode)
                    return NotFound($"No se encontro el  pokemon");

                string responseBody = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseBody);

                int id = doc.RootElement.GetProperty("id").GetInt32();
                string pokemonName = doc.RootElement.GetProperty("name").GetString()!;

                var pokemon = new PokemonDTO
                {
                    Name = pokemonName,
                    Sprite = new SpriteDto { FrontDefault = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png" }
                };

                return Ok(new PokemonPaginatedResponse { 
                    CurrentPage = 1, TotalPages = 1, Pokemons = new List<PokemonDTO> { pokemon } 
                });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Error de conexion a la API: {ex.Message}");
            }
        }

        //EndPoint por filtro de tipo

        [HttpGet("type/{type}")]
        public async Task<IActionResult> GetPokemonsByType(string type, [FromQuery] int page = 1)
        {
            try
            {
                string endPoint = $"{pokeApi}type/{type.ToLower()}";
                var response = await httpClient.GetAsync(endPoint);

                if (!response.IsSuccessStatusCode) 
                    return NotFound("Tipo no encontrado.");

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var apiResponseType = JsonSerializer.Deserialize<PokeApiTypeResponse>(await response.Content.ReadAsStringAsync(), options);

                var allPokemonsOfType = apiResponseType?.Pokemon?.Select(p => p.PokemonResult).ToList() ?? new List<PokemonResult>();

                //Limite de elementos (paginación)
                int limit = 10;
                int offset = (page - 1) * limit;
                int totalPages = (int)Math.Ceiling((double)allPokemonsOfType.Count / limit);

                var pagedPokemons = allPokemonsOfType.Skip(offset).Take(limit).ToList();

                var resultList = pagedPokemons.Select(p => 
                {
                    string id = p.Url!.TrimEnd('/').Split('/').Last();
                    return new PokemonDTO {
                        Name = p.Name,
                        Sprite = new SpriteDto { FrontDefault = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png" }
                    };
                }).ToList();

                return Ok(new PokemonPaginatedResponse { CurrentPage = page, TotalPages = totalPages, Pokemons = resultList });
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

    }
}
