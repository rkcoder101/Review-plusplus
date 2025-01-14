import React from 'react';

export default function PendingReviewCard({ id, assignmentTitle, submissionBy, submissionDate, team_name }) {
    const handleCardClick = () => {
        window.location.href = `http://localhost:5173/review/${id}`;
    };


    return (
        <div
            className="bg-gradient-to-r from-purple-700 to-blue-800 shadow-lg rounded-xl p-6 mb-6 w-full max-w-md text-white hover:scale-105 transform transition duration-300 cursor-pointer"
            onClick={handleCardClick}
        >
            <h2 className="text-xl font-extrabold mb-2">{assignmentTitle}</h2>
            <p className="text-sm opacity-90">
                <span className="font-semibold">Submission By:</span> {submissionBy}
            </p>
            {
                (team_name) ? <p className="text-sm opacity-90">
                    <span className="font-semibold">On Behalf of Team:</span> {team_name}
                </p> : <p></p>
            }          


            <p className="text-sm opacity-90 mt-1">
                <span className="font-semibold">Submission Date:</span> {new Date(submissionDate).toLocaleString()}
            </p>
        </div>
    );
}
