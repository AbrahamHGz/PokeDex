using System.Text.Json.Serialization;

namespace PokeDex.Server.DTOs
{
    public class PokemonDetailDTO
    {
        public string? Name {get; set;}
        public float Height {get; set;}
        public float Weight {get; set;}
        public float BaseExperience {get; set;}
        public string? SpriteUrl {get; set;}
    }
}