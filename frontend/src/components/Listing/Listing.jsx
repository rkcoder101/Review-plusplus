import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { useState, useEffect } from "react";



export default function Listing({ parameters }) {    

    // Fetching API
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => console.error('Error'));
    }, []);

    // Pagination
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const pages = Math.ceil(users.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return users.slice(start, end);
    }, [page, users]);

    return (
        <div style={{ backgroundColor: "#313232", padding: "20px", color: "#fff" }}>
            
            <Table
                className="m-10"
                aria-label="Example table with client-side pagination"
                removeWrapper
                bottomContent={
                    <div className="flex w-full justify-center" style={{ marginTop: "20px" }}>
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}

                        />
                    </div>
                }
            >
                <TableHeader
                    removeWrapper

                >
                    {parameters.map((parameter) => (
                        <TableColumn key={parameter} className="bg-slate-700 rounded-[5px] text-xl" >{parameter}</TableColumn>
                    ))}


                </TableHeader>

                <TableBody

                >
                    {items.map((item) => (
                        <TableRow key={item.id} className="text-xl">
                            {
                                parameters.map((p) => (
                                    <TableCell>{item[p]}</TableCell>
                                ))
                            }                            

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    );
}
