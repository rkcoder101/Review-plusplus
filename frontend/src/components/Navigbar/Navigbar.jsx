import { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import {logout} from "../../redux/slices/userSlice"
export default function Navigbar() {
    const [academic_session, setAcademic_ssession] = useState(2024);
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/asgns/logout/", {
                method: "POST", 
                credentials: "include"               
            });

            if (response.ok) {           
                  
                const responseData = await response.json(); 
                console.log("Logout response:", responseData);
                dispatch(logout());
                window.location.href = 'http://localhost:5173/login';

            } else {
                console.error("Failed to log out.");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    return (
        <div>
            <div className="bg-black w-full h-[60px] flex items-center justify-around px-4">

                <div className="text-white text-lg font-bold">
                    Review++
                </div>
                <div className="flex space-x-4">
                    <NavLink
                        to="dashboard"
                        className={({ isActive }) =>
                            `text-white hover:text-blue-300 ${isActive ? "text-blue-500 font-bold" : "text-white"}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/users/2"
                        className={({ isActive }) =>
                            `text-white hover:text-blue-300 ${isActive ? "text-blue-500 font-bold" : "text-white"}`
                        }
                    >
                        Profile
                    </NavLink>

                </div>
                <div>
                    <Button variant="contained" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>


        </div>
    );
}
