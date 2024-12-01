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
                alert('Name, City, and Address copied to clipboard');
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
            <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6 space-y-4">
                {/* Name */}
                <div className="flex items-center space-x-2">
                    <p className="text-lg">
                        <span className="font-semibold text-yellow-400">Name:</span> {place.name}
                    </p>
                </div>
                {/* Address */}
                <div className="flex items-center space-x-2">
                    <p className="text-lg">
                        <span className="font-semibold text-yellow-400">Address:</span> {place.address}
                    </p>
                </div>
                {/* City */}
                <div className="flex items-center space-x-2">
                    <p className="text-lg">
                        <span className="font-semibold text-yellow-400">City:</span> {place.city}
                    </p>
                </div>
                {/* Copy all button */}
                <div className="flex items-center justify-start">
                    <button
                        onClick={handleCopyAll}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Copy Name, City, and Address
                    </button>
                </div>
                {/* Total Votes */}
                <p className="text-lg mt-4">
                    <span className="font-semibold text-yellow-400">Total Votes:</span> {totalVotes > 0 ? totalVotes : 'No votes yet'}
                </p>
            </div>
            <h2 className="text-3xl font-semibold text-green-400 mb-4">Average by Categories</h2>
            <ul className="space-y-4">
                {categoryAverages.map((category, index) => (
                    <li
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition"
                    >
                        <p className="font-semibold text-yellow-300">{category.category}</p>
                        <p className="text-lg text-green-300">Average: {category.average}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
