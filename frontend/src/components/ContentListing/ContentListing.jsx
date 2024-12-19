import React, { useState } from 'react';
import axios from 'axios';
import TextArea from './TextArea';
import TextField from '@mui/material/TextField';
import UserSelectionDialog from './userSelectionDialog';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import { useUser } from '../../custom_hooks/useUser';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ReviewerSelectionDialog from './reviewerSelectionDialog';
import TeamSelectionDialog from './teamSelectionDialog';
export default function ContentListing() {
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleOpenUserDialog = () => {
        setOpenUserDialog(true);
    };

    const handleCloseUserDialog = () => {
        setOpenUserDialog(false);
    };

    const handleUsersSelected = (userIds) => {
        setSelectedUsers(userIds);
        console.log('Selected User IDs:', userIds);
    };
    //teams
    const [openTeamDialog, setOpenTeamDialog] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState([]);

    const handleOpenTeamDialog = () => {
        setOpenTeamDialog(true);
    };

    const handleCloseTeamDialog = () => {
        setOpenTeamDialog(false);
    };

    const handleTeamsSelected = (teamIds) => {
        setSelectedTeams(teamIds);
        console.log('Selected Team IDs:', teamIds);
    };

    const [openReviewerDialog, setOpenReviewerDialog] = useState(false);
    const [selectedReviewers, setSelectedReviewers] = useState([]);

    const handleOpenReviewerDialog = () => {
        setOpenReviewerDialog(true);
    };

    const handleCloseReviewerDialog = () => {
        setOpenReviewerDialog(false);
    };

    const handleReviewersSelected = (reviewerIds) => {
        setSelectedReviewers(reviewerIds);
        console.log('Selected Reviewer IDs:', reviewerIds);
    };

    const [subtasks, setSubtasks] = useState([{ text: '', files: [] }]);
    const [title, setTitle] = useState('');

    const addSubtask = () => {
        setSubtasks([...subtasks, { text: '', files: [] }]);
    };

    const removeLastSubtask = () => {
        if (subtasks.length > 1) {
            setSubtasks(subtasks.slice(0, -1));
        }
    };

    const updateSubtask = (index, field, value) => {
        setSubtasks((prev) =>
            prev.map((subtask, i) =>
                i === index ? { ...subtask, [field]: value } : subtask
            )
        );
    };


    const { user, status, error } = useUser();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const [dueDate, setDueDate] = useState(null);
    const handleAssign = async () => {
        const formData = new FormData();

        // Add assignment data
        formData.append('title', title);
        formData.append('date_of_assigning', `${yyyy}-${mm}-${dd}`);
        formData.append('due_date', dueDate?.toISOString().split('T')[0]);
        formData.append('assigner_id', user.id);
        selectedUsers.forEach((userId) => formData.append('user_ids', userId));
        selectedTeams.forEach((teamId) => formData.append('team_ids', teamId));
        selectedReviewers.forEach((reviewerId) => formData.append('reviewer_ids', reviewerId));

        // Add subtasks and their attachments
        subtasks.forEach((subtask, index) => {
            formData.append('subtasks', subtask.text);
            subtask.files.forEach((file) => {
                formData.append(`subtask_${index}_files`, file);
            });
        });

        try {
            const response = await axios.post('http://127.0.0.1:8000/asgns/create-assignment/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Assignment created successfully!', response.data);
            alert('Assignment created successfully!');
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert('Failed to create assignment.');
        }
    };

    if (status === 'loading') return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="flex flex-col gap-6 items-center">
                <div className="flex flex-row justify-between w-[80%] text-xl">
                    <div>Assigned by: {user.name}</div>
                    <div>Date of assigning: {`${dd}-${mm}-${yyyy}`}</div>
                </div>
                <div>
                    <TextField
                        label="Assignment Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />
                </div>
                <div className="flex flex-col items-center gap-4 w-[80%]">
                    {subtasks.map((subtask, index) => (
                        <TextArea
                            key={index}
                            index={index}
                            value={subtask.text}
                            updateSubtask={updateSubtask}
                            onFileUpload={(idx, files) =>
                                updateSubtask(idx, 'files', files)
                            }
                        />
                    ))}

                    <span>
                        <Fab
                            size="medium"
                            color="secondary"
                            aria-label="add"
                            onClick={addSubtask}
                            style={{ marginRight: '16px' }}
                        >
                            <AddIcon />
                        </Fab>
                        <Fab
                            size="medium"
                            color="secondary"
                            aria-label="remove"
                            onClick={removeLastSubtask}
                        >
                            <RemoveIcon />
                        </Fab>
                    </span>
                </div>
                <span style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Select Deadline"
                            value={dueDate}
                            onChange={(newDate) => setDueDate(newDate)}
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    size: 'small',
                                    sx: {
                                        width: '200px',
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>


                    <Button
                        variant="outlined"
                        onClick={handleOpenUserDialog}
                        sx={{
                            margin: '8px',
                            height: '40px',
                            minWidth: '120px',
                        }}
                    >
                        Select Users
                    </Button>
                    <UserSelectionDialog
                        open={openUserDialog}
                        onClose={handleCloseUserDialog}
                        onUsersSelected={handleUsersSelected}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleOpenTeamDialog}
                        sx={{
                            margin: '8px',
                            height: '40px',
                            minWidth: '120px',
                        }}
                    >
                        Select Teams
                    </Button>
                    <TeamSelectionDialog
                        open={openTeamDialog}
                        onClose={handleCloseTeamDialog}
                        onTeamsSelected={handleTeamsSelected}
                    />
                    <Button
                        variant="outlined"
                        sx={{
                            margin: '8px',
                            height: '40px',
                            minWidth: '120px',
                        }}
                        onClick={handleOpenReviewerDialog}
                    >
                        Select Reviewers
                    </Button>
                    <ReviewerSelectionDialog
                        open={openReviewerDialog}
                        onClose={handleCloseReviewerDialog}
                        onReviewersSelected={handleReviewersSelected}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            margin: '8px',
                            height: '40px',
                            minWidth: '120px',
                        }}
                        onClick={handleAssign}
                    >
                        Assign
                    </Button>

                    <Button
                        variant="outlined"
                        sx={{
                            margin: '8px',
                            height: '40px',
                            minWidth: '120px',
                        }}
                        onClick={() => console.log('Subtasks:', subtasks)}
                    >
                        Log Subtasks
                    </Button>
                </span>



            </div>
        </div>
    );
}
