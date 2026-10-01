import { useEffect, useState } from 'react';

interface Pokemon {
    name: string;
    sprite: {
        frontDefault: string;
    }
}

interface PaginatedResponse {
    currentPage: number; // Corregido: de currentPages a currentPage
    totalPages: number;
    pokemons: Pokemon[];
}

function App() {
    const [data, setData] = useState<PaginatedResponse>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Nuevos estados para los filtros
    const [searchInput, setSearchInput] = useState<string>(''); // Lo que el usuario escribe
    const [activeSearchTerm, setActiveSearchTerm] = useState<string>(''); // El nombre que se va a buscar
    const [selectedType, setSelectedType] = useState<string>(''); // El tipo seleccionado

    // Este useEffect se disparará automáticamente si cambia la página, el tipo o el término de búsqueda activo
    useEffect(() => {
        populatePokemonData(currentPage, activeSearchTerm, selectedType);
    }, [currentPage, activeSearchTerm, selectedType]);

    // Controles de Paginación
    const irPaginaSiguiente = () => {
        if (data && currentPage < data.totalPages) setCurrentPage(currentPage + 1);
    };

    const irPaginaAnterior = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Controles de Filtros
    const handleSearch = () => {
        setSelectedType(''); // Limpiamos el tipo si buscamos por nombre
        setActiveSearchTerm(searchInput);
        setCurrentPage(1); // Regresamos a la página 1
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchInput(''); // Limpiamos la caja de texto
        setActiveSearchTerm(''); // Limpiamos la búsqueda por nombre
        setSelectedType(e.target.value);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setActiveSearchTerm('');
        setSelectedType('');
        setCurrentPage(1);
    };

    let content;
    if (isLoading || !data) {
        content = (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                <span className="ml-3 text-gray-600 font-medium">Cargando Pokémon...</span>
            </div>
        );
    } else if (data.pokemons.length === 0) {
        content = (
            <div className="text-center py-10">
                <p className="text-xl text-gray-500 font-semibold">No se encontraron resultados.</p>
                <button onClick={handleClearFilters} className="mt-4 text-red-500 hover:underline">
                    Limpiar filtros
                </button>
            </div>
        );
    } else {
        content = (
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <tr>
                                <th className="px-6 py-3 font-bold border-b">Pokémon</th>
                                <th className="px-6 py-3 font-bold border-b text-center">Sprite</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.pokemons.map((pokemon, index) => (
                                <tr key={pokemon.name + index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-2 capitalize font-medium text-gray-800 align-middle">
                                        {pokemon.name}
                                    </td>
                                    <td className="px-6 py-2 text-center align-middle">
                                        <img
                                            src={pokemon.sprite.frontDefault}
                                            alt={`Sprite de ${pokemon.name}`}
                                            className="mx-auto w-16 h-16 object-contain drop-shadow-md"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Controles de Paginación Mejorados */}
                <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow border border-gray-200">
                    <button
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                        onClick={irPaginaAnterior}
                        disabled={currentPage === 1}>
                        &laquo; Anterior
                    </button>

                    <span className="font-bold text-gray-700">
                        Página {data.currentPage} de {data.totalPages}
                    </span>

                    <button
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                        onClick={irPaginaSiguiente}
                        disabled={currentPage === data.totalPages}>
                        Siguiente &raquo;
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="bg-red-500 border-b-4 border-red-700 shadow-md mb-8">
                <h1 className="flex justify-center p-5 text-yellow-300 font-extrabold text-3xl tracking-wider drop-shadow-md">
                    Pokédex Nacional
                </h1>
            </div>

            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Filtros de búsqueda</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Buscador por Nombre */}
                        <div className="flex flex-1">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Pikachu, charizard..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                className="bg-gray-800 text-white px-4 py-2 rounded-r-md hover:bg-gray-900 transition-colors font-medium"
                                onClick={handleSearch}>
                                Buscar
                            </button>
                        </div>

                        <div className="flex items-center text-gray-400 font-bold">Ó</div>

                        {/* Dropdown de Especie/Tipo */}
                        <div className="flex-1">
                            <select
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 capitalize bg-white"
                                value={selectedType}
                                onChange={handleTypeChange}
                            >
                                <option value="">Todos los tipos</option>
                                <option value="normal">Normal</option>
                                <option value="fire">Fuego</option>
                                <option value="water">Agua</option>
                                <option value="grass">Planta</option>
                                <option value="electric">Eléctrico</option>
                                <option value="ice">Hielo</option>
                                <option value="fighting">Lucha</option>
                                <option value="poison">Veneno</option>
                                <option value="ground">Tierra</option>
                                <option value="flying">Volador</option>
                                <option value="psychic">Psíquico</option>
                                <option value="bug">Bicho</option>
                                <option value="rock">Roca</option>
                                <option value="ghost">Fantasma</option>
                                <option value="dragon">Dragón</option>
                            </select>
                        </div>
                        
                        {(activeSearchTerm || selectedType) && (
                            <button 
                                onClick={handleClearFilters}
                                className="text-sm text-red-500 font-medium hover:underline whitespace-nowrap px-2">
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    {content}
                </div>
            </div>
        </div>
    );

    // Cambiamos la firma de la función para que reciba los filtros y construya la URL correcta
    async function populatePokemonData(pageNumber: number, searchTermValue: string, typeValue: string) {
        setIsLoading(true);

        let url = `api/pokemon?page=${pageNumber}`;
        
        if (searchTermValue) {
            url = `api/pokemon/${searchTermValue}`;
        } else if (typeValue) {
            url = `api/pokemon/type/${typeValue}?page=${pageNumber}`;
        }

        try {
            const response = await fetch(url); // <-- Faltaba hacer el fetch
            
            if (response.ok) {
                const fetchedData = await response.json();
                setData(fetchedData);
            } else {
                // Si la API devuelve un error (ej. 404), limpiamos la tabla
                setData({ currentPage: 1, totalPages: 1, pokemons: [] });
            }
        } catch (error) {
            console.error("Error al obtener los datos: ", error);
        }

        setIsLoading(false);
    }
}

export default App;