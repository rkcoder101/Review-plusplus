import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

const UserSelectionDialog = ({id, open, onClose, onUsersSelected }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    useEffect(() => {
        if (open) {
            setLoading(true);
            fetch(`http://127.0.0.1:8000/asgns/userlistforasgn/?user_id=${id}`, {
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
                    setUsers(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching users:', error);
                    setLoading(false);
                });
        }
    }, [open]);


    const columns = [

        { field: 'enrollment_number', headerName: 'Enrollment Number', width: 200 },
        { field: 'name', headerName: 'Name', width: 200 },
    ];

    const handleSelectionChange = (ids) => {
        setSelectedUserIds(ids);

    };

    const handleSave = () => {
        onUsersSelected(selectedUserIds);
        
        onClose();
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Select Users</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={users}
                            columns={columns}
                            checkboxSelection
                            onRowSelectionModelChange={(newSelection) => {
                                console.log('lawda');
                                setSelectedUserIds(newSelection);
                                
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
                <Button onClick={() => { console.log(selectedUserIds) }}>Log Selection</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserSelectionDialog;
