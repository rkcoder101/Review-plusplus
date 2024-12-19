import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

const ReviewerSelectionDialog = ({ open, onClose, onReviewersSelected }) => {
    const [reviewers, setReviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReviewerIds, setSelectedReviewerIds] = useState([]);

    useEffect(() => {
        if (open) {
            setLoading(true);
            fetch('http://127.0.0.1:8000/asgns/reviewers/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setReviewers(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching reviewers:', error);
                    setLoading(false);
                });
        }
    }, [open]);

    const columns = [
        { field: 'enrollment_number', headerName: 'Enrollment Number', width: 300 },
        { field: 'name', headerName: 'Name', width: 200 },
    ];

    const handleSelectionChange = (ids) => {
        setSelectedReviewerIds(ids);
    };

    const handleSave = () => {
        onReviewersSelected(selectedReviewerIds);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Select Reviewers</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={reviewers}
                            columns={columns}
                            checkboxSelection
                            onRowSelectionModelChange={(newSelection) => {
                                setSelectedReviewerIds(newSelection);
                            }}
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">
                    Save
                </Button>
                <Button onClick={() => { console.log(selectedReviewerIds); }}>
                    Log Selection
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewerSelectionDialog;
