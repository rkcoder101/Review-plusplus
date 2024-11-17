import TabComp from "../TabComp/TabComp";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useState } from "react";
import Button from '@mui/material/Button';
import FullScreenDialog from "../FullScreenDialog/FullScreenDialog";
import TeamCreation from "../TeamCreation/TeamCreation";
import ContentListing from "../ContentListing/ContentListing";
import Navigbar from "../Navigbar/Navigbar";


export default function Home() {
    // Dialog states
    const [isTeamDialogOpen, setTeamDialogOpen] = useState(false);
    const [isAssignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
    const [isManageUsersDialogOpen, setManageUsersDialogOpen] = useState(false);
    const [isViewAssignmentsDialogOpen, setViewAssignmentsDialogOpen] = useState(false);

    // Handlers for each dialog
    const handleTeamDialogOpen = () => setTeamDialogOpen(true);
    const handleTeamDialogClose = () => setTeamDialogOpen(false);

    const handleAssignmentDialogOpen = () => setAssignmentDialogOpen(true);
    const handleAssignmentDialogClose = () => setAssignmentDialogOpen(false);

    const handleManageUsersDialogOpen = () => setManageUsersDialogOpen(true);
    const handleManageUsersDialogClose = () => setManageUsersDialogOpen(false);

    const handleViewAssignmentsDialogOpen = () => setViewAssignmentsDialogOpen(true);
    const handleViewAssignmentsDialogClose = () => setViewAssignmentsDialogOpen(false);

    // States
    const [total_pending_assignments, setTotal_pending_assignments] = useState(3);
    const [total_pending_reviews, setTotal_pending_reviews] = useState(3);

    // Demo paper styling
    const DemoPaper = styled(Paper)(({ theme }) => ({
        width: 200,
        height: 150,
        padding: theme.spacing(3),
        ...theme.typography.body2,
        textAlign: 'center',
        background: 'linear-gradient(90deg, rgba(103,98,98,1) 0%, rgba(81,49,107,1) 100%)',

        color: '#fff',
    }));

    return (
        
            <div className="flex-grow flex h-full">
                <div className="w-[70%]  bg-gray-200">
                    <TabComp tabnames={['Pending Assignments', 'Pending Reviews', 'My Teams']} />
                </div>
                <div className="w-[30%]  flex flex-col bg-gray-300 ">
                    <div className="flex flex-col justify-center items-center h-[50%] gap-8 ">
                        <DemoPaper square={false}>
                            <p className="font-bold text-lg">Total Pending Assignments</p>
                            <br />
                            <p className="font-bold text-2xl">{total_pending_assignments}</p>
                        </DemoPaper>
                        <DemoPaper square={false}>
                            <p className="font-bold text-lg">Total Pending Reviews</p>
                            <br />
                            <p className="font-bold text-2xl">{total_pending_reviews}</p>
                        </DemoPaper>
                    </div>
                    <div className="flex flex-col items-center h-[50%] gap-12">
                        
                        <div className="w-[50%]">
                            <Button variant="outlined" fullWidth onClick={handleManageUsersDialogOpen}>Manage Users and Roles</Button>
                            {/* <FullScreenDialog open={isManageUsersDialogOpen} onClose={handleManageUsersDialogClose}>
                                    <ManageUsersRoles />
                                </FullScreenDialog> */}
                        </div>

                        
                        <div className="w-[50%]">
                            <Button variant="outlined" fullWidth onClick={handleViewAssignmentsDialogOpen}>View All Assignments</Button>
                            {/* <FullScreenDialog open={isViewAssignmentsDialogOpen} onClose={handleViewAssignmentsDialogClose}>
                                    <ViewAssignments />
                                </FullScreenDialog> */}
                        </div>

                        
                        <div className="w-[50%]">
                            <Button variant="outlined" fullWidth onClick={handleAssignmentDialogOpen}>Create an assignment</Button>
                            <FullScreenDialog open={isAssignmentDialogOpen} onClose={handleAssignmentDialogClose}>
                                <ContentListing />
                            </FullScreenDialog>
                        </div>


                        <div className="w-[50%]">
                            <Button variant="outlined" fullWidth onClick={handleTeamDialogOpen}>Create a Team</Button>
                            <FullScreenDialog open={isTeamDialogOpen} onClose={handleTeamDialogClose}>
                                <TeamCreation />
                            </FullScreenDialog>
                        </div>
                    </div>
                </div>
            </div>
        

    );
}
