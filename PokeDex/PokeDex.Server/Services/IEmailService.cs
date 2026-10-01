using PokeDex.Server.DTOs;

namespace PokeDex.Server.Services
{
    public interface IEmailService
    {
        Task EnviarPokemonsPorCorreoAsync(string CorreosDestino, List<PokemonDTO> pokemons);
    }
}