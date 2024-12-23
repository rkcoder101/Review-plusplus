import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReviewerSelectionDialog2 from "./reviewerSelectionDialog2";
import { useUser } from "../../custom_hooks/useUser";

export default function AsgnViewReviewee() {
    const { user, status, user_error } = useUser();
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submissionText, setSubmissionText] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [showReviewerDialog, setShowReviewerDialog] = useState(false);
    const [selectedReviewer, setSelectedReviewer] = useState(null);

    const BACKEND_URL = "http://127.0.0.1:8000/asgns";

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/assignments/${id}/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch assignment details.");
                }
                const data = await response.json();
                setAssignment(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [id]);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setAttachments((prevAttachments) => {
            const uniqueFiles = newFiles.filter(
                (file) => !prevAttachments.some((existingFile) => existingFile.name === file.name)
            );
            return [...prevAttachments, ...uniqueFiles];
        });
    };

    const handleSubmit = async () => {
        // Validation checks
        if (!submissionText.trim()) {
            alert("Please enter your submission content.");
            return;
        }
        if (!selectedReviewer) {
            alert("Please select a reviewer before submitting.");
            return;
        }

        const today = new Date().toISOString();
        console.log(user.id)
        console.log(id)
        console.log(today)
        console.log(submissionText)
        console.log(selectedReviewer)
        console.log(attachments)
        const formData = new FormData();
        formData.append("user", user.id);
        formData.append("assignment", id);
        formData.append("submission_date", today);
        formData.append("comments", submissionText);
        formData.append("reviewer", selectedReviewer);

        attachments.forEach((file) => {
            formData.append("attachments", file);
        });

        try {
            const response = await fetch(`${BACKEND_URL}/create-submission/`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to submit your work. Please try again.");
            }

            const data = await response.json();
            console.log("Submission successful:", data);
            alert("Your submission was successful!");
        } catch (err) {
            console.error(err.message);
            alert("An error occurred while submitting. Please try again.");
        }
    };

    const handleReviewerSelected = (reviewerId) => {
        setSelectedReviewer(reviewerId);
        console.log("Selected Reviewer:", reviewerId);
    };

    const extractFileName = (filePath) => {
        return filePath.split("/").pop();
    };

    if (loading) return <p className="text-center text-gray-500">Loading assignment details...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="p-6 bg-[#f9fafb] min-h-screen flex justify-center items-start">
            <div className="max-w-5xl w-full">
                <div className="flex justify-between items-center mb-8 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-700">Assigned by: {assignment.assigner}</p>
                    <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                    <div className="text-right">
                        <p className="text-gray-500">Date of Assignment: {assignment.date_of_assigning}</p>
                        <p className="text-gray-500">Deadline: {assignment.due_date}</p>
                    </div>
                </div>

                <div className="mb-8 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Subtasks</h2>
                    <div className="space-y-4">
                        {assignment.subtasks.map((subtask, index) => (
                            <div key={index} className="bg-[#f4f6f8] p-4 rounded-lg shadow-sm border border-gray-300">
                                <label className="block font-semibold text-gray-700 mb-2" htmlFor={`subtask-${index}`}>
                                    Subtask {index + 1}
                                </label>
                                <input
                                    id={`subtask-${index}`}
                                    type="text"
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

                <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Select Reviewer</h2>
                    <button
                        onClick={() => setShowReviewerDialog(true)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Select Reviewer
                    </button>
                </div>

                {showReviewerDialog && (
                    <ReviewerSelectionDialog2
                        open={showReviewerDialog}
                        onClose={() => setShowReviewerDialog(false)}
                        onReviewerSelected={handleReviewerSelected}
                        id={id}
                    />
                )}

                <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Submit Your Work</h2>
                    <textarea
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        className="w-full border rounded-lg p-3 mb-4 border-gray-300"
                        placeholder="Enter your submission details here..."
                    />
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700 mb-2">Upload Attachments</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full border-gray-300 rounded-lg"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
