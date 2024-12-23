import React, { useEffect, useState } from "react";

const ReviewerSelectionDialog2 = ({ open, onClose, onReviewerSelected, id }) => {
    const [reviewers, setReviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReviewerId, setSelectedReviewerId] = useState(null);

    useEffect(() => {
        if (open) {
            setLoading(true);
            fetch(`http://127.0.0.1:8000/asgns/assignments/${id}/reviewers/`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setReviewers(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching reviewers:", error);
                    setLoading(false);
                });
        }
    }, [open]);

    const handleSave = () => {
        if (selectedReviewerId) {
            onReviewerSelected(selectedReviewerId);
            onClose();
        } else {
            alert("Please select a reviewer before saving.");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Select a Reviewer</h2>
                {loading ? (
                    <p className="text-gray-500">Loading reviewers...</p>
                ) : (
                    <ul className="space-y-4">
                        {reviewers.map((reviewer) => (
                            <li key={reviewer.id} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`reviewer-${reviewer.id}`}
                                    name="reviewer"
                                    value={reviewer.id}
                                    checked={selectedReviewerId === reviewer.id}
                                    onChange={() => setSelectedReviewerId(reviewer.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`reviewer-${reviewer.id}`}
                                    className="ml-3 text-gray-800 font-medium"
                                >
                                    {reviewer.reviewer_name}
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewerSelectionDialog2;
