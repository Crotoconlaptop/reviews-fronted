const BASE_URL = 'http://localhost:3000/api/places';

// Agregar un nuevo lugar
export const addPlace = async (placeData) => {
    const response = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeData),
    });
    if (!response.ok) throw new Error('Error al agregar el lugar');
    return response.json();
};

// Enviar votación
export const ratePlace = async (placeId, ratings) => {
    const response = await fetch(`${BASE_URL}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: placeId, ratings }),
    });
    if (!response.ok) throw new Error('Error al enviar la evaluación');
    return response.json();
};

// Obtener el ranking de lugares
export const fetchRanking = async () => {
    const response = await fetch(`${BASE_URL}/ranking`);
    if (!response.ok) throw new Error('Error al cargar el ranking');
    return response.json();
};

// Obtener detalles de un lugar
export const getPlaceDetails = async (placeId) => {
    const response = await fetch(`${BASE_URL}/${placeId}`);
    if (!response.ok) throw new Error('Error al obtener los detalles del lugar');
    return response.json();
};
