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

    const [total_pending_assignments, setTotal_pending_assignments] = useState(3);
    const [total_pending_reviews, setTotal_pending_reviews] = useState(3);

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


    return (
        <div className="flex-grow flex h-full">
            <div className="w-[70%] bg-gray-200">
                <TabComp
                    tabs={tabs}
                    tabContents={tabContents}
                />
            </div>
            <div className="w-[30%] flex flex-col bg-gray-300">
                <div className="flex flex-col justify-center items-center h-[50%] gap-8">
                    <DemoPaper square={false}>
                        <p className="font-bold text-lg">Total Pending Assignments</p>
                        <p className="font-bold text-2xl">{total_pending_assignments}</p>
                    </DemoPaper>
                    <DemoPaper square={false}>
                        <p className="font-bold text-lg">Total Pending Reviews</p>
                        <p className="font-bold text-2xl">{total_pending_reviews}</p>
                    </DemoPaper>
                </div>
                <div className="flex flex-col items-center h-[50%] gap-12">
                    <Button variant="outlined" fullWidth onClick={handleManageUsersDialogOpen}>Manage Users and Roles</Button>
                    <Button variant="outlined" fullWidth onClick={handleViewAssignmentsDialogOpen}>View All Assignments</Button>
                    <Button variant="outlined" fullWidth onClick={handleAssignmentDialogOpen}>Create an assignment</Button>
                    <FullScreenDialog open={isAssignmentDialogOpen} onClose={handleAssignmentDialogClose}>
                        <AsgnView_reviewer />
                    </FullScreenDialog>
                    <Button variant="outlined" fullWidth onClick={handleTeamDialogOpen}>Create a Team</Button>
                    <FullScreenDialog open={isTeamDialogOpen} onClose={handleTeamDialogClose}>
                        <TeamCreation />
                    </FullScreenDialog>
                </div>
            </div>
        </div>
    );
}

