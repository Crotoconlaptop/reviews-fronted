import React, { useState, useEffect } from 'react';
import { fetchRanking } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [topPlaces, setTopPlaces] = useState([]);
    const [bottomPlaces, setBottomPlaces] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRanking = async () => {
            try {
                const { topPlaces, bottomPlaces } = await fetchRanking();
                setTopPlaces(topPlaces);
                setBottomPlaces(bottomPlaces);
            } catch (error) {
                console.error('Error al cargar el ranking:', error);
            }
        };

        loadRanking();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-8">
                    <p className="mt-4 text-lg md:text-xl text-yellow-400 max-w-3xl mx-auto">
                        Share and review your work experiences. Explore the best and worst workplaces based on
                        community ratings. Your voice matters, contribute to improving the work environment for everyone.
                    </p>
                    <h1 className="text-5xl font-bold text-yellow-500">Anonymous Reviews</h1>
                    <button
                        onClick={() => navigate('/vote')}
                        className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Add Voting
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <RankingList title="Best Places" places={topPlaces} type="top" />
                    <RankingList title="Worst Places" places={bottomPlaces} type="bottom" />
                </div>
            </div>
        </div>
    );
}

const RankingList = ({ title, places, type }) => {
    const navigate = useNavigate();

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? '★' : '';
        const emptyStars = 5 - Math.ceil(rating);

        return (
            <>
                {'★'.repeat(fullStars)}
                {halfStar}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    return (
        <div>
            <h2
                className={`text-3xl font-semibold ${
                    type === 'top' ? 'text-green-400' : 'text-red-400'
                }`}
            >
                {title}
            </h2>
            <ul
                className="space-y-4 mt-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900"
                style={{ maxHeight: '320px' }}
            >
                {places.map((place) => (
                    <li
                        key={place.id}
                        className={`p-4 rounded-lg shadow-md cursor-pointer ${
                            type === 'top' ? 'bg-green-900 hover:bg-green-800' : 'bg-red-900 hover:bg-red-800'
                        }`}
                        onClick={() => navigate(`/details/${place.id}`)}
                    >
                        <h3 className="font-bold text-yellow-300">{place.name}</h3>
                        <p className="text-yellow-400">
                            {renderStars(parseFloat(place.averageRating) || 0)}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
