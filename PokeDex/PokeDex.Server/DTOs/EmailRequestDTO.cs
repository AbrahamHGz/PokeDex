namespace PokeDex.Server.DTOs
{
    public class EmailRequestDTO
    {
        public string? CorreosDestino {get; set;}
        public List<PokemonDTO>? Pokemons {get; set;}
    }
}