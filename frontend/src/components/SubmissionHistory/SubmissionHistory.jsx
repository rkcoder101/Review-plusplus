import React, { useEffect, useState } from "react";
import { useUser } from "../../custom_hooks/useUser";
export default function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useUser(); 

  useEffect(() => {
    if (user){
        const fetchSubmissions = async () => {
            try {
              const response = await fetch(`http://127.0.0.1:8000/asgns/users/${user.id}/submissionhistory/`);
              if (!response.ok) throw new Error("Failed to fetch submissions.");
      
              const data = await response.json();
              setSubmissions(data);
            } catch (err) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          };
      
          fetchSubmissions();
    }
    
  }, [user]);

  if (loading) return <div className="text-center text-gray-700">Loading submissions...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Submission History</h1>
      {submissions.length === 0 ? (
        <div className="text-center text-gray-600">No submissions found.</div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className={`p-4 border rounded shadow-md ${
                submission.checked ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">
                {submission.assignment_title}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Assigned By:</strong> {submission.assigner}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Reviewer:</strong> {submission.reviewer_name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Comments:</strong> {submission.comments}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Date:</strong> {new Date(submission.submission_date).toLocaleString()}
              </p>
              {submission.team_name && (
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Team:</strong> {submission.team_name}
                </p>
              )}
              <p className="text-sm text-gray-800 font-bold">
                Status: {submission.checked ? "Checked" : "Unchecked"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

