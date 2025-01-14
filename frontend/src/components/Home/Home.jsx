import TabComp from "../TabComp/TabComp";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useState } from "react";
import Button from '@mui/material/Button';
import FullScreenDialog from "../FullScreenDialog/FullScreenDialog";
import TeamCreation from "../TeamCreation/TeamCreation";
import PendingReviewCard from "./pendingReviewCard";
import { useEffect } from 'react';
import { useUser } from "../../custom_hooks/useUser";
import AssignmentCard from "./AssignmentCard";
import AsgnView_reviewer from "../ContentListing/AsgnView_reviewer";
import TeamCard from "./teamCard";

export default function Home() {
    const { user, status, error } = useUser();

    const [isTeamDialogOpen, setTeamDialogOpen] = useState(false);
    const [isAssignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
    const [isManageUsersDialogOpen, setManageUsersDialogOpen] = useState(false);
    const [isViewAssignmentsDialogOpen, setViewAssignmentsDialogOpen] = useState(false);

    const handleTeamDialogOpen = () => setTeamDialogOpen(true);
    const handleTeamDialogClose = () => setTeamDialogOpen(false);

    const handleAssignmentDialogOpen = () => setAssignmentDialogOpen(true);
    const handleAssignmentDialogClose = () => setAssignmentDialogOpen(false);

    const handleManageUsersDialogOpen = () => setManageUsersDialogOpen(true);
    const handleManageUsersDialogClose = () => setManageUsersDialogOpen(false);

    const handleViewAssignmentsDialogOpen = () => setViewAssignmentsDialogOpen(true);
    const handleViewAssignmentsDialogClose = () => setViewAssignmentsDialogClose(false);

    const DemoPaper = styled(Paper)(({ theme }) => ({
        width: 200,
        height: 150,
        padding: theme.spacing(3),
        ...theme.typography.body2,
        textAlign: 'center',
        background: 'linear-gradient(90deg, rgba(103,98,98,1) 0%, rgba(81,49,107,1) 100%)',
        color: '#fff',
    }));

    async function fetchPendingAssignments(userId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/asgns/pending-assignments/?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error("Failed to fetch pending assignments");
                return [];
            }
        } catch (error) {
            console.error("Error:", error);
            return [];
        }
    }

    const [pending_assignments, setPending_Assignments] = useState([]);
    useEffect(() => {
        if (user) {
            fetchPendingAssignments(user.id).then(data => {
                if (data) {
                    setPending_Assignments(data);
                }
            });
        }
    }, [user]);

    async function fetchPendingReviews(userId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/asgns/pending-reviews/?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error("Failed to fetch pending reviews");
                return [];
            }
        } catch (error) {
            console.error("Error:", error);
            return [];
        }
    }
    const [pendingReviews, setPendingReviews] = useState([]);

    useEffect(() => {
        if (user?.is_reviewer || user?.is_admin) {
            fetchPendingReviews(user.id).then(data => {
                if (data) {
                    setPendingReviews(data);
                }
            });
        }
    }, [user]);

    async function fetchUserTeams(userId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/asgns/user-teams/?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error("Failed to fetch user teams");
                return [];
            }
        } catch (error) {
            console.error("Error:", error);
            return [];
        }
    }
    const [userTeams, setUserTeams] = useState([]);
    useEffect(() => {
        if (user) {
            fetchUserTeams(user.id).then(data => {
                if (data) {
                    setUserTeams(data);
                }
            });
        }
    }, [user]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;

    if (!user) return <div>Something went wrong. Please try again later.</div>;


    const tabs = ['Pending Assignments'];
    const tabContents = [
        <div key="pending-assignments">
            {pending_assignments.length > 0 ? (
                pending_assignments.map((assignment, index) => (
                    <AssignmentCard
                        id={assignment.assignment}
                        key={index}
                        assigner={assignment.assigner}
                        title={assignment.assignment__title}
                        pendingDate={assignment.assignment__due_date}
                    />
                ))
            ) : (
                <p>No pending assignments</p>
            )}
        </div>
    ];

    if (user.is_admin || user.is_reviewer) {
        tabs.push('Pending Reviews');
        tabContents.push(
            <div key="pending-reviews">
                {pendingReviews.length > 0 ? (
                    pendingReviews.map((review, index) => (
                        <PendingReviewCard
                            key={index}
                            id={review.id}
                            assignmentTitle={review.assignment_title}
                            submissionBy={review.submission_by}
                            submissionDate={review.submission_date}
                            team_name={review.team_name}
                        />
                    ))
                ) : (
                    <p>No pending reviews</p>
                )}
            </div>
        );
    }

    tabs.push('My Teams');
    tabContents.push(
        <div key="my-teams">
            {userTeams.length > 0 ? (
                userTeams.map((team, index) => (
                    <TeamCard
                        key={index}
                        id={team.id}
                        teamName={team.name}
                    />
                ))
            ) : (
                <p>No teams found</p>
            )}
        </div>
    );
    const getFirstName = (fullName) => {
        if (fullName) {
            return fullName.split(' ')[0];
        }
        return '';
    };
    let first_name = "";
    if (user) {
        first_name = getFirstName(user.name);
    }


    return (
        <div className="flex h-full">
            {/* Left Section */}
            <div className="w-[70%] bg-gray-100 p-6">
                <TabComp tabs={tabs} tabContents={tabContents} />
            </div>

            {/* Right Section */}
            <div className="w-[30%] bg-white shadow-lg p-6">
                {/* Stats Section */}
                <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
                    Welcome, {first_name}!
                </h1>
                <div className="grid gap-6 mb-8">
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-md">
                        <p className="text-blue-900 text-sm font-semibold">Total Pending Assignments</p>
                        <p className="text-xl font-bold text-blue-800">{pending_assignments.length}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg shadow-md">
                        <p className="text-green-900 text-sm font-semibold">Total Pending Reviews</p>
                        <p className="text-xl font-bold text-green-800">{pendingReviews.length}</p>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="grid gap-4">
                    {user.is_admin && (
                        <button
                            className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
                            onClick={() => { window.location.href = `http://localhost:5173/manageusersandroles/` }}
                        >
                            Manage Users and Roles
                        </button>
                    )}
                    {(user.is_admin || user.is_reviewer) && (
                        <>
                            <button
                                className="w-full py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow"
                                onClick={handleAssignmentDialogOpen}
                            >
                                Create an Assignment
                            </button>
                            <FullScreenDialog open={isAssignmentDialogOpen} onClose={handleAssignmentDialogClose}>
                                <AsgnView_reviewer />
                            </FullScreenDialog>
                            <button
                                className="w-full py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow"
                                onClick={handleTeamDialogOpen}
                            >
                                Create a Team
                            </button>
                            <FullScreenDialog open={isTeamDialogOpen} onClose={handleTeamDialogClose}>
                                <TeamCreation />
                            </FullScreenDialog>

                        </>
                    )}
                </div>
            </div>
        </div>

    );
}

