import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPlace, ratePlace } from '../api';

const categories = [
    { id: 'HR', description: 'HUMAN RESOURCES: evaluates how attentive HR is to employees’ needs and whether they address concerns promptly. 1 star = bad HR support, 5 stars = excellent HR support' },
    { id: 'FRONT DESK', description: 'FRONT DESK: focuses on how respectful and cooperative the reception staff are. 1 star = poor collaboration, 5 stars = excellent collaboration' },
    { id: 'FOOD&BEVERAGE', description: 'FOOD&BEVERAGE: evaluates the quality and service of food and beverages. 1 star = poor quality, 5 stars = excellent quality' },
    { id: 'HOUSEKEEPING', description: 'HOUSEKEEPING: assesses cleanliness and organization in the facilities. 1 star = messy, 5 stars = pristine' },
    { id: 'LAUNDRY', description: 'LAUNDRY: evaluates how well the laundry services handle items like uniforms. 1 star = bad service, 5 stars = excellent care' },
    { id: 'LP', description: 'LOSS PREVENTION: focuses on how well they cooperate with other departments and whether they communicate and interact respectfully when handling safety concerns. 1 star = unsafe, 5 stars = very safe' },
    { id: 'MARKETING', description: 'MARKETING: evaluates whether they maintain respectful, clear, and professional communication with colleagues from other sectors. 1 star = poor, 5 stars = outstanding communication' },
    { id: 'EMPLOYEE DINING ROOM', description: 'EMPLOYEE DINING ROOM: assesses the staff’s attitude towards employees from other departments and the quality of the food provided. 1 star = bad food, 5 stars = great food' },
    { id: 'QUALITY OF THE GUEST', description: 'QUALITY OF THE GUEST: evaluates whether guests are respectful, well-mannered, and professional, or if they exhibit rude, vulgar, or inappropriate behavior. 1 star = rude, 5 stars = professional' },
    { id: 'HONESTY', description: 'HONESTY: assesses whether the company keeps its promises (e.g., growth opportunities, schedules) and whether there are issues like employee theft or dishonesty. 1 star = dishonest, 5 stars = very trustworthy' },
    { id: 'DISCRIMINATION', description: 'DISCRIMINATION: evaluates whether employees feel discriminated against in any form, fostering an environment of equality and inclusion. 1 star = discriminatory, 5 stars = inclusive' },
    { id: 'ANIMAL ABUSE', description: 'ANIMAL ABUSE: assesses whether employees handle animals responsibly and ensure they are treated humanely, without causing harm. 1 star = abusive, 5 stars = humane treatment' },
    { id: 'ACCOMMODATION', description: 'ACCOMMODATION: evaluates the living spaces and the staff behavior. 1 star = poor accommodation, 5 stars = excellent.' },
];

export default function VoteScreen() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', city: '', address: '' });
    const [ratings, setRatings] = useState({});
    const [omittedCategories, setOmittedCategories] = useState(new Set());
    const [average, setAverage] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const weights = {
        'DISCRIMINATION': 2,
        'ANIMAL ABUSE': 2,
        'ACCOMMODATION': 2,
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePasteForm = (e) => {
        const pastedData = e.clipboardData.getData('text').split('|');
        if (pastedData.length === 3) {
            setForm({
                name: pastedData[0].trim().toLowerCase(),
                city: pastedData[1].trim().toLowerCase(),
                address: pastedData[2].trim().toLowerCase(),
            });
        } else {
            alert('Invalid format! Please paste the copied Name | City | Address.');
        }
    };

    const handleVoteChange = (categoryId, value) => {
        if (omittedCategories.has(categoryId)) {
            omittedCategories.delete(categoryId);
            setOmittedCategories(new Set(omittedCategories));
        }

        const updatedRatings = { ...ratings, [categoryId]: value };
        setRatings(updatedRatings);

        calculateAverage(updatedRatings);
    };

    const handleOmitCategory = (categoryId) => {
        const updatedRatings = { ...ratings };
        delete updatedRatings[categoryId];
        setRatings(updatedRatings);

        omittedCategories.add(categoryId);
        setOmittedCategories(new Set(omittedCategories));

        calculateAverage(updatedRatings);
    };

    const calculateAverage = (updatedRatings) => {
        const validRatings = Object.entries(updatedRatings).filter(([key]) => !omittedCategories.has(key));
        const totalWeightedScore = validRatings.reduce((sum, [key, rating]) => {
            const weight = weights[key] || 1;
            return sum + rating * weight;
        }, 0);

        const totalWeights = validRatings.reduce((sum, [key]) => {
            return sum + (weights[key] || 1);
        }, 0);

        setAverage(totalWeights > 0 ? (totalWeightedScore / totalWeights).toFixed(2) : 0);
    };

    const handleSubmit = async () => {
        const totalCategories = categories.length;
        const totalResponses = Object.keys(ratings).length + omittedCategories.size;
    
        if (!form.name || !form.city || !form.address) {
            setErrorMessage('Please fill in all the required fields (Name, City, and Address).');
            return;
        }
    
        if (totalResponses !== totalCategories) {
            setErrorMessage('Please rate or omit every category before submitting.');
            return;
        }
    
        try {
            const { place } = await addPlace(form);
    
            const submittedRatings = categories.map((category) =>
                omittedCategories.has(category.id) ? null : ratings[category.id]
            );
    
            await ratePlace(place.id, submittedRatings);
            alert('Thank you for your feedback!');
            navigate('/');
        } catch (error) {
            console.error('Error submitting the evaluation:', error);
    
            // Extract backend error message
            if (error.response) {
                setErrorMessage(error.response.data.error || 'An unknown error occurred.');
            } else {
                setErrorMessage('You can only vote once every 3 months for this place.');
            }
        }
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white p-6">
            <button
                onClick={() => navigate('/')}
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Back
            </button>
            <h1 className="text-4xl font-bold text-yellow-500 mb-6">Submit Vote</h1>

            <div className="space-y-4">
                <textarea
                    placeholder="Paste Name | City | Address here..."
                    onPaste={handlePasteForm}
                    className="border border-yellow-500 rounded p-2 w-full bg-gray-900 text-white placeholder-gray-500"
                ></textarea>
                <input
                    type="text"
                    name="name"
                    placeholder="Place Name (required)"
                    value={form.name}
                    onChange={handleFormChange}
                    className="border border-yellow-500 rounded p-2 w-full bg-gray-900 text-white placeholder-gray-500"
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City (required)"
                    value={form.city}
                    onChange={handleFormChange}
                    className="border border-yellow-500 rounded p-2 w-full bg-gray-900 text-white placeholder-gray-500"
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address (required)"
                    value={form.address}
                    onChange={handleFormChange}
                    className="border border-yellow-500 rounded p-2 w-full bg-gray-900 text-white placeholder-gray-500"
                />
            </div>

            <div className="mt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-yellow-400">Rate the categories:</h2>
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`flex flex-col mb-4 ${
                            omittedCategories.has(category.id) ? 'bg-gray-800 opacity-50' : ''
                        } p-4 rounded-lg`}
                    >
                        <span className="font-medium text-yellow-300">{category.description}</span>
                        <div className="flex mt-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    onClick={() => handleVoteChange(category.id, value)}
                                    className={`text-xl px-2 ${
                                        ratings[category.id] >= value
                                            ? 'text-yellow-500'
                                            : 'text-gray-500'
                                    }`}
                                    disabled={omittedCategories.has(category.id)}
                                >
                                    ★
                                </button>
                            ))}
                            <button
                                onClick={() => handleOmitCategory(category.id)}
                                className={`ml-4 px-4 py-1 ${
                                    omittedCategories.has(category.id)
                                        ? 'bg-red-400 text-gray-800'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                } rounded transition`}
                            >
                                {omittedCategories.has(category.id) ? 'Omitted' : 'Omit'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {errorMessage && (
                <p className="text-red-500 font-semibold mt-4">{errorMessage}</p>
            )}

            <div className="mt-8">
                <p className="text-lg font-semibold text-yellow-300">
                    Overall Average: {average || 'No Rating'}
                </p>
                <button
                    onClick={handleSubmit}
                    className={`mt-4 px-6 py-3 ${
                        Object.keys(ratings).length + omittedCategories.size === categories.length
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-500 cursor-not-allowed'
                    } text-white rounded-lg transition`}
                    disabled={
                        Object.keys(ratings).length + omittedCategories.size !== categories.length
                    }
                >
                    Submit Evaluation
                </button>
            </div>
        </div>
    );
}
