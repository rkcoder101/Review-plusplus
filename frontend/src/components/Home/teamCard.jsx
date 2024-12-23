import React from 'react';

export default function TeamCard({ id, teamName }) {
    const handleCardClick = () => {
        window.location.href = `http://localhost:5173/team/${id}`;
    };

    return (
        <div 
            className="bg-gradient-to-r from-teal-700 to-green-800 shadow-lg rounded-xl p-6 mb-6 w-full max-w-md text-white hover:scale-105 transform transition duration-300 cursor-pointer"
            onClick={handleCardClick}
        >
            <h2 className="text-xl font-extrabold mb-2">{teamName}</h2>
            <p className="text-sm opacity-90">
                Click to view team details and assignments.
            </p>
        </div>
    );
}
