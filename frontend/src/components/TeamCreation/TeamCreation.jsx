import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

function EnhancedTableToolbar({ numSelected }) {
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Users
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Add">
                    <IconButton>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            ) : null}
        </Toolbar>
    );
}

export default function TeamCreation() {
    const [title, setTitle] = useState('');
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/asgns/users/', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch users: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Fetched users:', data);
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = users.map((user) => user.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const isSelected = (id) => selected.indexOf(id) !== -1;

    if (loading) {
        return <div className="flex justify-center items-center m-10 text-2xl">Loading...</div>;
    }

    return (
        <div className="m-10 flex flex-col justify-center gap-4">
            <div className="flex flex-row justify-center ">
                <h1 className="text-4xl">Make Your Team</h1>
            </div>
            <div className='flex flex-row justify-center'>
                <TextField placeholder='Enter team name' value={title} onChange={(e) => { setTitle(e.target.value); }} />
            </div>
            <div>
                <Box sx={{ width: '80%', margin: 'auto' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                        <TableContainer>
                            <Table sx={{ minWidth: 750 }} aria-label="user data table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox" sx={{ fontSize: '1.2rem' }}>
                                            <Checkbox
                                                color="primary"
                                                indeterminate={
                                                    selected.length > 0 &&
                                                    selected.length < users.length
                                                }
                                                checked={
                                                    users.length > 0 &&
                                                    selected.length === users.length
                                                }
                                                onChange={handleSelectAllClick}
                                                inputProps={{
                                                    'aria-label': 'select all users',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.2rem' }}>
                                            Enrollment Number
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.2rem' }}>Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleRows.map((user) => {
                                        const isItemSelected = isSelected(user.id);
                                        const labelId = `enhanced-table-checkbox-${user.id}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, user.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={user.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox" sx={{ fontSize: '1.2rem' }}>
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '1.2rem' }}>
                                                    {user.enrollment_number}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '1.2rem' }}>
                                                    {user.name}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={users.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>
            </div>
            <div className='flex flex-row justify-center gap-8'>
                <Button onClick={() => { console.log(selected) }}>Log Members</Button>
                <Button
                    variant="contained"
                    onClick={async () => {
                        if (!title) {
                            alert("Please enter a team name.");
                            return;
                        }
                        if (selected.length === 0) {
                            alert("Please select at least one member.");
                            return;
                        }

                        try {
                            const response = await fetch('http://127.0.0.1:8000/asgns/teams/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                    name: title,
                                    members: selected,
                                }),
                            });

                            if (!response.ok) {
                                throw new Error(`Failed to save team: ${response.statusText}`);
                            }

                            const data = await response.json();
                            console.log('Team saved:', data);
                            alert(data.message);
                            setTitle(''); 
                            setSelected([]); 
                        } catch (error) {
                            console.error('Error saving team:', error);
                            alert('Failed to save the team. Please try again.');
                        }
                    }}
                >
                    Save
                </Button>

            </div>
        </div>
    );
}

