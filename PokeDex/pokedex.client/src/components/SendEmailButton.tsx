import { useState } from 'react';

interface Pokemon {
    name: string;
    sprite: {
        frontDefault: string;
    }
}

interface SendEmailButtonProps {
    pokemons: Pokemon[];
}

export default function SendEmailButton({ pokemons }: SendEmailButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [emails, setEmails] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');

    const handleSendEmail = async () => {
        if (!emails.trim() || pokemons.length === 0) return;

        setIsSending(true);
        setStatusMessage('');

        try {
            const response = await fetch('api/pokemon/export/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correosDestino: emails,
                    pokemons: pokemons
                })
            });

            if (response.ok) {
                setStatusMessage('¡Correo enviado con éxito!');
                setEmails(''); 
                setTimeout(() => {
                    setIsModalOpen(false);
                    setStatusMessage('');
                }, 2000); // Cerramos el modal después de 2 segundos
            } else {
                setStatusMessage(' Error al enviar el correo.');
            }
        } catch (error) {
            setStatusMessage(' Error de conexión.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
          
            <button 
                onClick={() => setIsModalOpen(true)}
                disabled={!pokemons || pokemons.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-sm font-medium"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Enviar por Correo
            </button>

            {/* Modal de Tailwind */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Compartir Pokémon</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Ingresa los correos electrónicos. Puedes enviar a varios separándolos por comas (,).
                        </p>
                        
                        <input 
                            type="text" 
                            placeholder="ejemplo1@correo.com, ejemplo2@correo.com"
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {statusMessage && (
                            <p className="text-sm font-medium mb-4 text-center">{statusMessage}</p>
                        )}

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => { setIsModalOpen(false); setStatusMessage(''); }}
                                disabled={isSending}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSendEmail}
                                disabled={isSending || !emails.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center gap-2"
                            >
                                {isSending ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                ) : null}
                                {isSending ? 'Enviando...' : 'Enviar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}