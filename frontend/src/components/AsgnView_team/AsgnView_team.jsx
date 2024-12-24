import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../../custom_hooks/useUser";
import ReviewerSelectionDialog2 from "../AsgnView_reviewee/reviewerSelectionDialog2";
export default function AsgnViewTeam() {
    const { teamId: teamId } = useParams();
    const { assignmentId: assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [comments, setComments] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [showReviewerDialog, setShowReviewerDialog] = useState(false);
    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const {user,status,userError}= useUser()
    const BACKEND_URL = "http://127.0.0.1:8000/asgns";

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/assignments/${assignmentId}/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch assignment details.");
                }
                const data = await response.json();
                setAssignment(data);
                setLoading(false);
                console.log(teamId)
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    const handleFileChange = (e) => {
        setAttachments([...e.target.files]);

    };

    const extractFileName = (filePath) => {
        return filePath.split("/").pop();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmissionMessage("");     

        const formData = new FormData();
        const today = new Date().toISOString();
        console.log(teamId)
        console.log(assignmentId)
        console.log(today)        
        console.log(selectedReviewer)
        console.log(attachments)
        console.log(user.id)
        formData.append("assignment", assignmentId);
        formData.append("comments", comments);
        formData.append("user", user.id);
        formData.append("team", teamId);
        formData.append("reviewer", selectedReviewer);
        formData.append("submission_date", today);
        
        attachments.forEach((file) => {
            formData.append("attachments", file);
        });

        try {
            const response = await fetch(`${BACKEND_URL}/create-submission/`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to submit the assignment.");
            }

            const data = await response.json();
            setSubmissionMessage("Submission successful!");
            setComments("");
            setAttachments([]);
        } catch (err) {
            setSubmissionMessage(`Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };
    const handleReviewerSelected = (reviewerId) => {
        setSelectedReviewer(reviewerId);
        console.log("Selected Reviewer:", reviewerId);
    };

    if (loading) return <p className="text-center text-gray-500">Loading assignment details...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="p-6 bg-[#f9fafb] min-h-screen flex justify-center items-start">
            <div className="max-w-5xl w-full">
                {/* Assignment Details */}
                <div className="flex justify-between items-center mb-8 bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-700">Assigned by: {assignment.assigner}</p>
                    <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                    <div className="text-right">
                        <p className="text-gray-500">Date of Assignment: {assignment.date_of_assigning}</p>
                        <p className="text-gray-500">Deadline: {assignment.due_date}</p>
                    </div>
                </div>

                {/* Subtasks */}
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
                                            {subtask.attachments.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {subtask.attachments.map((attachment, i) => {
                                                        const fileName = extractFileName(attachment.file); // Get file name dynamically
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
                        id={assignmentId}
                    />
                )}

                {/* Submission Form */}
                <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Submit Your Work</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            placeholder="Add comments (optional)"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="w-full border-gray-300 rounded-lg p-3 bg-white"
                        />
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                    {submissionMessage && (
                        <p
                            className={`mt-4 ${submissionMessage.startsWith("Error") ? "text-red-500" : "text-green-500"
                                }`}
                        >
                            {submissionMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
