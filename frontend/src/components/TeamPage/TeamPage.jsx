import { useState } from "react";

export default function TeamPage() {
    const [team, setTeam] = useState({
        name: "TeamName",
        members: [
            { id: 1, name: "John Doe", role: "Developer" },
            { id: 2, name: "Jane Smith", role: "Designer" },
            { id: 3, name: "Alex Johnson", role: "Tester" },
            { id: 4, name: "Emily Davis", role: "Developer" },
            { id: 5, name: "Michael Brown", role: "Designer" },
            { id: 6, name: "Sophia Lee", role: "Tester" },
            { id: 7, name: "David Wilson", role: "Developer" },
            { id: 8, name: "Sarah Taylor", role: "Designer" },
            { id: 9, name: "Chris Evans", role: "Tester" },
            { id: 10, name: "Liam White", role: "Developer" },
        ],
        pendingAssignments: [
            { id: 1, title: "Assignment 1", description: "Description of Assignment 1", deadline: "2024-12-30" },
            { id: 2, title: "Assignment 2", description: "Description of Assignment 2", deadline: "2024-12-25" },
        ]
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastMember = currentPage * itemsPerPage;
    const indexOfFirstMember = indexOfLastMember - itemsPerPage;
    const currentMembers = team.members.slice(indexOfFirstMember, indexOfLastMember);

    return (
        <div className="container mx-auto p-6">
            {/* Team Name */}
            <h1 className="text-4xl font-extrabold mb-6 text-gray-800">{team.name}</h1>

            {/* Team Members Section */}
            <div className="members-section mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Team Members</h2>
                
                {/* Team Members Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentMembers.map((member) => (
                        <div key={member.id} className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                            <p className="text-sm text-gray-100">{member.role}</p>
                        </div>
                    ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-6 flex justify-center space-x-4">
                    <button 
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    >
                        Previous
                    </button>
                    <span className="text-lg font-semibold text-gray-800">{currentPage}</span>
                    <button 
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
                        onClick={() => paginate(currentPage < Math.ceil(team.members.length / itemsPerPage) ? currentPage + 1 : currentPage)}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Pending Assignments Section */}
            <div className="assignments-section mt-12">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Pending Assignments</h2>
                {team.pendingAssignments.length > 0 ? (
                    <div className="space-y-4">
                        {team.pendingAssignments.map((assignment) => (
                            <div key={assignment.id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all duration-200">
                                <h3 className="text-xl font-semibold text-gray-800">{assignment.title}</h3>
                                <p className="text-sm text-gray-600">{assignment.description}</p>
                                <p className="text-sm text-gray-500">Deadline: {assignment.deadline}</p>
                                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    Mark as Completed
                                </button>
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
