import React from 'react';

// Exportamos la interfaz
export interface PokemonDetail {
    name: string;
    weight: number;
    height: number;
    baseExperience: number;
    spriteUrl: string;
}

interface PokemonDetailModalProps {
    isOpen: boolean;
    isLoading: boolean;
    pokemon: PokemonDetail | null;
    onClose: () => void;
}

export default function PokemonDetailModal({ isOpen, isLoading, pokemon, onClose }: PokemonDetailModalProps) {
    // Si el modal no está abierto, no renderizamos nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden relative">
                
             
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

            
                {isLoading || !pokemon ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
                        <p className="text-gray-500 font-medium">Buscando datos en el Pokédex...</p>
                    </div>
                ) : (
                    <>
                      
                        <div className="bg-red-500 pt-8 pb-4 flex justify-center border-b-4 border-red-700">
                            <div className="bg-white p-2 rounded-full shadow-inner mt-4">
                                <img 
                                    src={pokemon.spriteUrl} 
                                    alt={pokemon.name} 
                                    className="w-24 h-24 object-contain drop-shadow-md"
                                />
                            </div>
                        </div>
                        
                        {/* Cuerpo del Modal */}
                        <div className="p-6 text-center">
                            <h3 className="text-2xl font-bold text-gray-800 capitalize mb-6">
                                {pokemon.name}
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Peso</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {pokemon.weight / 10} <span className="text-sm font-normal">kg</span>
                                    </p>
                                </div>
                                
                                <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Altura</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {pokemon.height / 10} <span className="text-sm font-normal">m</span>
                                    </p>
                                </div>
                                
                                <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-200 col-span-2 shadow-sm text-center">
                                    <p className="text-xs text-yellow-700 uppercase font-bold mb-1">Experiencia Base</p>
                                    <div className="flex justify-center items-center gap-2">
                                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <p className="text-xl font-extrabold text-yellow-800">
                                            {pokemon.baseExperience} <span className="text-sm font-semibold">XP</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}