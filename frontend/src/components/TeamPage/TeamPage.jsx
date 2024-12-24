import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TeamPage() {
    const { teamId: teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/asgns/teams/${teamId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch team data");
                }
                const data = await response.json();
                setTeam({
                    name: data.team_name,
                    members: data.members.map((member) => ({
                        id: member.id,
                        name: member.name,
                        enrollment_number: member.enrollment_number,
                    })),
                    pendingAssignments: data.pending_assignments.map((assignment) => ({
                        id: assignment.assignment__id,
                        title: assignment.assignment__title,
                        assigner: assignment.assignment__assigner__user__name,
                    })),
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [teamId]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-screen">
            {/* Left Section: Team Members */}
            <div className="w-1/3 bg-gradient-to-b from-gray-100 to-gray-200 p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Team Members</h2>
                <div className="space-y-4">
                    {team.members.map((member) => (
                        <div
                            key={member.id}
                            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200"
                        >
                            <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                            <p className="text-sm text-gray-500">Enrollment: {member.enrollment_number}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Section: Pending Assignments */}
            <div className="w-2/3 bg-white p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Pending Assignments</h2>
                {team.pendingAssignments.length > 0 ? (
                    <div className="space-y-6">
                        {team.pendingAssignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                onClick={() => window.location.href=`http://localhost:5173/team/${teamId}/assignment/${assignment.id}`}
                                className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                            >
                                <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">Assigned by: {assignment.assigner}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No pending assignments for this team.</p>
                )}
            </div>
        </div>
    );
}
