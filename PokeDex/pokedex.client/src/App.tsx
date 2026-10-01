import { useEffect, useState } from 'react';

interface Pokemon {
    name: string;
    
    sprite: {
       frontDefault: string;
    }
}



function App() {

    const [pokemons, setPokemons] = useState<Pokemon[]>();


    useEffect(() => {
        populatePokemonData();
    }, []);



    const content = pokemons === undefined
        ? <p><em>Cargando Pokemons...</em></p>
        : <table className="table table-striped border rounded-sm" aria-labelledby="tableLabel">
            <thead>
                <tr  className='text-2xl'>
                    <th>Pokémon</th>
                    <th>Sprite</th>
                </tr>
            </thead>
            <tbody>
                
                {pokemons.map(pokemon =>
                    <tr key={pokemon.name}>
                       
                        <td style={{ verticalAlign: 'middle', textTransform: 'capitalize' }}>
                            {pokemon.name}
                        </td>
                        <td>
                            {/* 2. Usamos una etiqueta <img> para mostrar la URL */}
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
         </table>; 

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

    async function populatePokemonData(){
        const response = await fetch('api/pokemon');

        if(response.ok){
            const data = await response.json();
            setPokemons(data);
        }

    }
}

export default App;