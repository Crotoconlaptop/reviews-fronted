import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaceDetails } from '../api';

export default function PlaceDetails() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [categoryAverages, setCategoryAverages] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { place, averagesByCategory, totalVotes } = await getPlaceDetails(placeId);
                setPlace(place);
                setCategoryAverages(averagesByCategory);
                setTotalVotes(totalVotes);
            } catch (error) {
                console.error('Error loading place details:', error);
            }
        };

        fetchDetails();
    }, [placeId]);

    const handleCopyAll = () => {
        if (place) {
            const concatenatedData = `${place.name} | ${place.city} | ${place.address}`;
            navigator.clipboard.writeText(concatenatedData).then(() => {
                alert('Copied: Name, City, and Address');
            }).catch((err) => {
                console.error('Error copying data:', err);
            });
        }
    };

    if (!place) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white flex items-center justify-center">
                <p className="text-yellow-300 text-lg">Loading place details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Back
            </button>
            <h1 className="text-4xl font-bold text-yellow-500 mb-6">{place.name}</h1>
            <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6">
                <p className="text-lg">
                    <span className="font-semibold text-yellow-400">Address:</span> {place.address}
                </p>
                <p className="text-lg mt-2">
                    <span className="font-semibold text-yellow-400">City:</span> {place.city}
                </p>
                <p className="text-lg mt-2">
                    <span className="font-semibold text-yellow-400">Total Votes:</span> {totalVotes > 0 ? totalVotes : 'No votes yet'}
                </p>
                <button
                    onClick={handleCopyAll}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    Copy Name, City, and Address
                </button>
            </div>
        </div>
    );
}
