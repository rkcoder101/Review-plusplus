import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

const TeamSelectionDialog = ({ open, onClose, onTeamsSelected }) => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeamIds, setSelectedTeamIds] = useState([]);

    useEffect(() => {
        if (open) {
            setLoading(true);
            fetch('http://127.0.0.1:8000/asgns/listteams/', {
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
                    setTeams(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching teams:', error);
                    setLoading(false);
                });
        }
    }, [open]);

    const columns = [
        { field: 'name', headerName: 'Team Name', width: 300 },
        
    ];

    const handleSelectionChange = (ids) => {
        setSelectedTeamIds(ids);
    };

    const handleSave = () => {
        onTeamsSelected(selectedTeamIds);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Select Teams</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={teams}
                            columns={columns}
                            checkboxSelection
                            onRowSelectionModelChange={(newSelection) => {
                                setSelectedTeamIds(newSelection);
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
                <Button onClick={() => { console.log(selectedTeamIds); }}>
                    Log Selection
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TeamSelectionDialog;
