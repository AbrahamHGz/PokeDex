import { useState } from 'react';

// Replica de la interfaz de los datos 
interface Pokemon {
    name: string;
    sprite: {
        frontDefault: string;
    }
}

interface ExportExcelButtonProps {
    pokemons: Pokemon[];
    currentPage: number;
}

export default function ExportExcelButton({ pokemons, currentPage }: ExportExcelButtonProps) {
    const [isExporting, setIsExporting] = useState<boolean>(false);

    const handleExportExcel = async () => {
        if (!pokemons || pokemons.length === 0) return;

        setIsExporting(true); // Cambiamos el estado para mostrar el icono de carga

        try {
            const response = await fetch('api/pokemon/export/excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pokemons)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Pokedex_Pagina_${currentPage}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Error al exportar a Excel");
            }
        } catch (error) {
            console.error("Error en la petición de exportación:", error);
        } finally {
            setIsExporting(false); // Apagamos el estado de carga
        }
    };

    return (
        <button 
            onClick={handleExportExcel}
            disabled={!pokemons || pokemons.length === 0 || isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-sm font-medium"
        >
           
            {isExporting ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            )}
            
            {isExporting ? 'Exportando...' : 'Exportar a Excel'}
        </button>
    );
}