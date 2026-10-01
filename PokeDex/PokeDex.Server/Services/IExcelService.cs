using PokeDex.Server.DTOs;

namespace PokeDex.Server.Services
{
    public interface IExcelService
    {
        byte[] GeneratePokemonExcel(List<PokemonDTO> pokemons);
    }
}