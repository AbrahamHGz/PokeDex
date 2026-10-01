using ClosedXML.Excel;
using PokeDex.Server.DTOs;

namespace PokeDex.Server.Services
{
    public class ExcelService : IExcelService
    {
        public byte[] GeneratePokemonExcel(List<PokemonDTO> pokemons)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Pokemons");

                worksheet.Cell(1,1).Value = "Nombre del Pokemon";
                worksheet.Cell(1,2).Value = "URL del sprite";

                // Formato a las cabeceras
                var headerRow = worksheet.Row(1);
                headerRow.Style.Font.Bold = true;
                headerRow.Style.Fill.BackgroundColor = XLColor.Red;
                headerRow.Style.Font.FontColor = XLColor.White;

                // Llenar los datos
                int row = 2;
                foreach (var pokemon in pokemons)
                {
                   
                    string nombreCapitalizado = char.ToUpper(pokemon.Name![0]) + pokemon.Name.Substring(1);
                    
                    worksheet.Cell(row, 1).Value = nombreCapitalizado;
                    worksheet.Cell(row, 2).Value = pokemon.Sprite?.FrontDefault;
                    row++;
                }

                // Autoajustar las columnas al tamaño del texto
                worksheet.Columns().AdjustToContents();

                // Convertir el archivo a un arreglo de bytes para enviarlo
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }
    }
}