import React, { useEffect, useState } from 'react';
import { useUser } from '../../custom_hooks/useUser';

export default function ReviewHistory() {
    const { user } = useUser();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetch(`http://127.0.0.1:8000/asgns/users/${user.id}/reviewhistory`)
                .then(response => response.json())
                .then(data => {
                    setReviews(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching review history:', error);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 h-full">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Review History</h1>
            {reviews.length === 0 ? (
                <div className="text-center text-gray-600">No reviews found.</div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className={`p-4 border rounded-lg shadow-md ${
                                review.submitted_by_team ? "bg-purple-100" : "bg-blue-100"
                            }`}
                        >
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">{review.submission_title}</h2>
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Submitted by:</strong> {review.submitted_by_user}
                            </p>
                            {review.submitted_by_team && (
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Team:</strong> {review.submitted_by_team}
                                </p>
                            )}
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Submission Date:</strong> {new Date(review.submission_date).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Review Date:</strong> {new Date(review.date).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Comments:</strong> {review.comments}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
