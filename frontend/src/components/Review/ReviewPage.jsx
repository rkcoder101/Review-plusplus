import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ReviewPage() {
    const { id } = useParams(); // Extract submission ID from URL
    const [data, setData] = useState(null); // State to store fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [submissionText, setSubmissionText] = useState(""); // Submission text state

    const BACKEND_URL = "http://127.0.0.1:8000/asgns";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/review/${id}/`);
                if (!response.ok) throw new Error("Failed to fetch data.");
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const extractFileName = (filePath) => filePath.split("/").pop();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const { current_submission, assignment_details, previous_submissions } = data;
    
    const handleMarkAsCompleted = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/mark_as_completed/${current_submission.allocation}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to mark as completed.");
            }
    
            const result = await response.json();
            alert(result.message); 
        } catch (err) {
            console.error(err.message);
            alert("Failed to mark as completed. Please try again.");
        }
    };

    const handleSubmit = async () => {
        const reviewData = {
            submission: current_submission.id,
            date: new Date().toISOString(),
            comments: submissionText,
        };

        try {
            const response = await fetch(`${BACKEND_URL}/review/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error("Failed to add review.");
            }

            const result = await response.json();
            alert("Review added successfully!");
            setSubmissionText("");
        } catch (err) {
            console.error(err.message);
            alert("Failed to add review. Please try again.");
        }
    };


    return (
        <div className="p-6 bg-[#f9fafb] min-h-screen flex justify-center items-start">
            <div className="max-w-5xl w-full">
                {/* Assignment Details */}
                <div className="flex justify-between items-center mb-8 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-700">Assigned by: {assignment_details.assigner}</p>
                    <h1 className="text-2xl font-bold text-gray-900">{assignment_details.title}</h1>
                    <div className="text-right">
                        <p className="text-gray-500">Date of Assignment: {assignment_details.date_of_assigning}</p>
                        <p className="text-gray-500">Deadline: {assignment_details.due_date}</p>
                    </div>
                </div>

                {/* Subtasks */}
                <div className="mb-8 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Subtasks</h2>
                    <div className="space-y-4">
                        {assignment_details.subtasks.map((subtask, index) => (
                            <div key={index} className="bg-[#f4f6f8] p-4 rounded-lg shadow-sm border border-gray-300">
                                <label className="block font-semibold text-gray-700 mb-2" htmlFor={`subtask-${index}`}>
                                    Subtask {index + 1}
                                </label>
                                <textarea
                                    id={`subtask-${index}`}
                                    value={subtask.text}
                                    readOnly
                                    className="w-full border-gray-300 rounded-lg p-3 bg-gray-200"
                                />
                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Attachments:</h4>
                                    {subtask.attachments.length > 0 ? (
                                        <ul className="space-y-2">
                                            {subtask.attachments.map((attachment, i) => {
                                                const fileName = extractFileName(attachment.file);
                                                return (
                                                    <li
                                                        key={i}
                                                        className="flex items-center justify-between p-2 border rounded-lg bg-white shadow-sm"
                                                    >
                                                        <span className="text-gray-800">{fileName}</span>
                                                        <a
                                                            href={`${BACKEND_URL}${attachment.file}`}
                                                            download={fileName}
                                                            className="text-blue-500 underline hover:text-blue-600"
                                                        >
                                                            Download
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No attachments available</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Previous Submissions */}
                <div className="mb-8 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Previous Submissions</h2>
                    {previous_submissions.length > 0 ? (
                        previous_submissions.map((submission, index) => (
                            <div key={index} className="mb-4">
                                <label
                                    className="block font-semibold text-gray-700 mb-2"
                                    htmlFor={`previous-submission-${index}`}
                                >
                                    Submission {index + 1}
                                </label>
                                <textarea
                                    id={`previous-submission-${index}`}
                                    value={submission.comments}
                                    readOnly
                                    className="w-full border-gray-300 rounded-lg p-3 bg-gray-200 mb-2"
                                />
                                <p className="text-gray-500">Date: {submission.submission_date}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No previous submissions available</p>
                    )}
                </div>

                {/* Current Submission */}
                <div className="mb-8 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Current Submission</h2>
                    <p className="text-gray-700">Submitted by: {current_submission.submission_by}</p>
                    <input
                        value={current_submission.comments}
                        readOnly
                        className="w-full border-gray-300 rounded-lg p-3 bg-gray-200 mt-2 mb-4"
                    />
                    <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Attachments:</h4>
                        {current_submission.attachments.map((attachment, i) => {
                            const fileName = extractFileName(attachment.file);
                            return (
                                <li
                                    key={i}
                                    className="flex items-center justify-between p-2 border rounded-lg bg-white shadow-sm"
                                >
                                    <span className="text-gray-800">{fileName}</span>
                                    <a
                                        href={`${BACKEND_URL}${attachment.file}`}
                                        download={fileName}
                                        className="text-blue-500 underline hover:text-blue-600"
                                    >
                                        Download
                                    </a>
                                </li>
                            );
                        })}
                    </div>
                </div>

                {/* Review Input */}
                <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Add Your Review</h2>
                    <textarea
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        className="w-full border rounded-lg p-3 mb-4 border-gray-300"
                        placeholder="Enter your review here..."
                    />
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Submit
                    </button>
                    <button
                        onClick={handleMarkAsCompleted}
                        className="ml-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    >
                        Mark as Completed
                    </button>
                </div>
            </div>
        </div>
    );
}
