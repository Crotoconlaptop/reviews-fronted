import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaceDetails } from '../api';

export default function PlaceDetails() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [categoryAverages, setCategoryAverages] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0); // Estado para los votos totales
    const [copySuccess, setCopySuccess] = useState(''); // Estado para el mensaje de copia

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { place, averagesByCategory, totalVotes } = await getPlaceDetails(placeId);
                setPlace(place);
                setCategoryAverages(averagesByCategory);
                setTotalVotes(totalVotes); // Actualizamos el estado de totalVotes
            } catch (error) {
                console.error('Error al cargar los detalles del lugar:', error);
            }
        };

        fetchDetails();
    }, [placeId]);

    const handleCopyAddress = () => {
        if (place && place.address) {
            navigator.clipboard.writeText(place.address)
                .then(() => setCopySuccess('Address copied to clipboard!'))
                .catch(() => setCopySuccess('Failed to copy address.'));
            setTimeout(() => setCopySuccess(''), 2000); // Limpiar el mensaje después de 2 segundos
        }
    };

    if (!place) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white flex items-center justify-center">
                <p className="text-yellow-300 text-lg">Cargando detalles del lugar...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Volver
            </button>
            <h1 className="text-4xl font-bold text-yellow-500 mb-6">{place.name}</h1>
            <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6">
                <p className="text-lg">
                    <span className="font-semibold text-yellow-400">Dirección:</span> {place.address || 'No especificada'}
                    <button
                        onClick={handleCopyAddress}
                        className="ml-4 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Copy
                    </button>
                </p>
                {copySuccess && <p className="text-green-400 text-sm mt-2">{copySuccess}</p>}
                <p className="text-lg mt-2">
                    <span className="font-semibold text-yellow-400">Ciudad:</span> {place.city}
                </p>
                <p className="text-lg mt-2">
                    <span className="font-semibold text-yellow-400">Total de Votos:</span> {totalVotes > 0 ? totalVotes : 'Aún no hay votos'}
                </p>
            </div>
            <h2 className="text-3xl font-semibold text-green-400 mb-4">Promedios por Categoría</h2>
            <ul className="space-y-4">
                {categoryAverages.map((category, index) => (
                    <li
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition"
                    >
                        <p className="font-semibold text-yellow-300">{category.category}</p>
                        <p className="text-lg text-green-300">Promedio: {category.average}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
