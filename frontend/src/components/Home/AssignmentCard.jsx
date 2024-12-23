import React from 'react';

export default function AssignmentCard({ id, assigner, title, pendingDate }) {
    const handleCardClick = () => {        
        window.location.href = `http://localhost:5173/assignment/${id}`;
    };

    return (
        <div 
            className="bg-gradient-to-r from-indigo-700 to-violet-800 shadow-lg rounded-xl p-6 mb-6 w-full max-w-md text-white hover:scale-105 transform transition duration-300 cursor-pointer"
            onClick={handleCardClick}
        >
            <h2 className="text-xl font-extrabold mb-2">{title}</h2>
            <p className="text-sm opacity-90">
                <span className="font-semibold">Assigned By:</span> {assigner}
            </p>
            <p className="text-sm opacity-90 mt-1">
                <span className="font-semibold">Pending Date:</span> {pendingDate}
            </p>
        </div>
    );
}
