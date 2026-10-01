using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace PokeDex.Server.DTOs
{
    
    public class PokeApiListResponse
    {
        [JsonPropertyName("count")]
        public int Count {get; set;}

        [JsonPropertyName("results")]
        public List<PokemonResult>? Results { get; set; }
    }
        
    public class PokemonResult
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }  

        [JsonPropertyName("url")]
        public string? Url { get; set; }

    }

    public class PokemonDTO
    {
        public string? Name { get; set; }
        public SpriteDto? Sprite { get; set; }

    }

    public class SpriteDto
    {
        public string? FrontDefault { get; set; }
    }


    public class PokemonPaginatedResponse
    {
        public int CurrentPage {get; set;}
        public int TotalPages {get; set;}
        public List<PokemonDTO>? Pokemons {get; set;}
    }
}
