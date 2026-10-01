using System.Text.Json.Serialization;


namespace PokeDex.Server.DTOs
{
    public class PokeApiTypeResponse
    {
        [JsonPropertyName("pokemon")]
        public List<TypePokemon>? Pokemon {get; set;}
    }

    public class TypePokemon
    {
        [JsonPropertyName("pokemon")]
        public PokemonResult? PokemonResult {get; set;}
    }
}