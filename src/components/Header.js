import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-yellow-500 text-black p-4 shadow-md">
            <h1 className="text-3xl font-extrabold text-center">
                <Link to="/">TRUE Hospitality</Link>
                <p>(beta)</p>
            </h1>
        </header>
    );
}
