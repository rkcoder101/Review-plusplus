import { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
export default function Navigbar() {
    const [academic_session, setAcademic_ssession] = useState(2024);

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
                    <Button variant="contained">
                        Logout
                    </Button>
                </div>
            </div>


        </div>
    );
}
