import * as React from 'react';
import { useState, useEffect } from 'react';
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
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);

    // Fetch data from the API
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching data:', error));
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

    return (
        <div className='m-10'>
            <div className='flex flex-row justify-center items-center'>
                <h1 className='text-4xl'>Make Your Team</h1>
            </div>
            <div>
                <Box sx={{ width: '80%', margin: 'auto' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                        <TableContainer>
                            <Table sx={{ minWidth: 750 }} aria-label="user data table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox" sx={{ fontSize: '1.2rem' }} >
                                            <Checkbox
                                                color="primary"
                                                indeterminate={selected.length > 0 && selected.length < users.length}
                                                checked={users.length > 0 && selected.length === users.length}
                                                onChange={handleSelectAllClick}
                                                inputProps={{
                                                    'aria-label': 'select all users',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.2rem' }} >Email</TableCell>
                                        <TableCell sx={{ fontSize: '1.2rem' }} >Name</TableCell>
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
                                                <TableCell padding="checkbox" sx={{ fontSize: '1.2rem' }} >
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '1.2rem' }} >{user.email}</TableCell>
                                                <TableCell sx={{ fontSize: '1.2rem' }} >{user.name}</TableCell>
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
        </div>
    );
}
