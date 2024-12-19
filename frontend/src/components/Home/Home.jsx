import TabComp from "../TabComp/TabComp";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useState } from "react";
import Button from '@mui/material/Button';
import FullScreenDialog from "../FullScreenDialog/FullScreenDialog";
import TeamCreation from "../TeamCreation/TeamCreation";
import ContentListing from "../ContentListing/ContentListing";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUser } from "../../custom_hooks/useUser";

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
    const handleViewAssignmentsDialogClose = () => setViewAssignmentsDialogOpen(false);

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

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;

    if (!user) return <div>Something went wrong. Please try again later.</div>;

    return (
        <div className="flex-grow flex h-full">
            <div className="w-[70%] bg-gray-200">
                <TabComp tabnames={['Pending Assignments', 'Pending Reviews', 'My Teams']} />
                <div className="flex justify-center align-center">
                    {user?.is_admin && user?.is_reviewer && <h1>You are an Admin and a Reviewer</h1>}
                    {user?.is_admin && !user?.is_reviewer && <h1>You are an Admin only</h1>}
                    {!user?.is_admin && user?.is_reviewer && <h1>You are a Reviewer only</h1>}
                    {!user?.is_admin && !user?.is_reviewer && <h1>You are a normie</h1>}
                </div>
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
                        <ContentListing />
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
