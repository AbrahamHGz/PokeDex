import { useEffect, useState } from 'react';

interface Pokemon {
    name: string;
    
    sprite: {
       frontDefault: string;
    }
}

interface PaginatedResponse {
    currentPages: number;
    totalPages: number;
    pokemons: Pokemon[];
}

function App() {
    const [data, setData] = useState<PaginatedResponse>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
   


    useEffect(() => {
        populatePokemonData(currentPage);
    }, [currentPage]);

    const irPaginaSiguiente = () => {
        if(data && currentPage < data.totalPages){
            setCurrentPage(currentPage + 1);
        }
    };

    const irPaginaAnterior = () => {
        if(currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    let content;
    if (isLoading || !data) {
        content = <p><em>Cargando Pokémon...</em></p>;
    } else {
        content = (
<>
                <table className="table table-striped border" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Pokémon</th>
                            <th>Sprite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.pokemons.map(pokemon =>
                            <tr key={pokemon.name}>
                                <td style={{ verticalAlign: 'middle', textTransform: 'capitalize' }}>
                                    {pokemon.name}
                                </td>
                                <td>
                                    <img 
                                        src={pokemon.sprite.frontDefault} 
                                        alt={`Sprite de ${pokemon.name}`} 
                                        width="96" 
                                        height="96" 
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {/* Controles de Paginación Manuales */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button 
                        className="btn btn-primary" 
                        onClick={irPaginaAnterior} 
                        disabled={currentPage === 1}>
                        Anterior
                    </button>
                    
                    <span className="fw-bold">
                        Página {data.currentPages} de {data.totalPages}
                    </span>
                    
                    <button 
                        className="btn btn-primary" 
                        onClick={irPaginaSiguiente} 
                        disabled={currentPage === data.totalPages}>
                        Siguiente
                    </button>
                </div>
            </>
         );
        }

    return (
        <div className=''>
            <div className='bg-red-500 borde shadow-md'>
                <h1 id="tableLabel" className='flex justify-center p-5 text-yellow-200 font-bold text-2xl'>The PokeDex</h1>
            </div>
            <p>Lista de los primeros 150 Pokémons.</p>
            <div className='flex justify-center'>
                {content}
            </div>
        </div>
    );

    async function populatePokemonData(pageNumber: number){
        setIsLoading(true); // Carga de pantalla
        const response = await fetch(`api/pokemon?page=${pageNumber}`);

        if(response.ok){
            const data = await response.json();
            setData(data);
        }
        
        setIsLoading(false);
    }
}

export default App;