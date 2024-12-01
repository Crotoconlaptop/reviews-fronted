import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPlace, ratePlace } from '../api';

const categories = [
    { id: 'HR', description: 'HUMAN RESOURCES: Evaluates HR responsiveness and care for employees. 1 star = poor, 5 stars = excellent.' },
    { id: 'FRONT DESK', description: 'FRONT DESK: Assesses professionalism and communication with colleagues. 1 star = poor, 5 stars = excellent.' },
    { id: 'FOOD&BEVERAGE', description: 'FOOD&BEVERAGE: Evaluates food quality and respect for colleagues. 1 star = poor, 5 stars = excellent.' },
    { id: 'HOUSEKEEPING', description: 'HOUSEKEEPING: Assesses cleanliness and professionalism. 1 star = poor, 5 stars = excellent.' },
    { id: 'LAUNDRY', description: 'LAUNDRY: Evaluates laundry service quality and respect for others. 1 star = poor, 5 stars = excellent.' },
    { id: 'LP', description: 'LOSS PREVENTION: Evaluates safety and collaboration. 1 star = poor, 5 stars = excellent.' },
    { id: 'MARKETING', description: 'MARKETING: Assesses communication and respect across departments. 1 star = poor, 5 stars = excellent.' },
    { id: 'EMPLOYEE DINING ROOM', description: 'EMPLOYEE DINING ROOM: Evaluates food quality and respect in the dining area. 1 star = poor, 5 stars = excellent.' },
    { id: 'QUALITY OF THE GUEST', description: 'QUALITY OF THE GUEST: Evaluates guest behavior and professionalism. 1 star = poor, 5 stars = excellent.' },
    { id: 'HONESTY', description: 'HONESTY: Assesses trustworthiness and integrity. 1 star = dishonest, 5 stars = very trustworthy.' },
    { id: 'DISCRIMINATION', description: 'DISCRIMINATION: Evaluates inclusivity. 1 star = discriminatory, 5 stars = inclusive.' },
    { id: 'ANIMAL ABUSE', description: 'ANIMAL ABUSE: Assesses humane treatment of animals. 1 star = abusive, 5 stars = humane treatment.' },
    { id: 'ACCOMMODATION', description: 'ACCOMMODATION: Evaluates living arrangements provided by the workplace. 1 star = poor, 5 stars = excellent.' },
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

    const handlePasteData = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const [name, city, address] = pastedData.split(' | ');
        if (name && city && address) {
            setForm({ name, city, address });
        } else {
            alert('Invalid format. Please use the format: "Name | City | Address".');
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
            setErrorMessage('Please fill in all required fields (Name, City, and Address).');
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
            console.error('Error submitting evaluation:', error);
            alert('The evaluation could not be submitted.');
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
            <h1 className="text-4xl font-bold text-yellow-500 mb-6">Submit Evaluation</h1>

            <div className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Place Name (required)"
                    value={form.name}
                    onChange={handleFormChange}
                    onPaste={handlePasteData}
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

            {/* Rest of the component */}
        </div>
    );
}
