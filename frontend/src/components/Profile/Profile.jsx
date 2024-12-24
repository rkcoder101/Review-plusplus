import { Button } from "@nextui-org/react";
import Navigbar from "../Navigbar/Navigbar";
import { TextField } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import ProfileForm from "../ProfileForm/ProfileForm";
export default function Profile() {
    return (

        <div className="flex flex-col h-full">
            <div className="flex-grow flex">
                <div className="w-[30%] bg-gray-100 flex flex-col justify-center items-center gap-12">
                    <img src="/images/user.png" alt="Example" className="rounded-full w-80 h-80" />
                    <div className="flex flex-col items-center gap-4">

                        <Link to="submission_history"><Button variant="outlined"><p className="text-xl">Submission History</p></Button></Link>
                        <Link to="review_history"><Button variant="outlined"><p className="text-xl">Review History</p></Button></Link>

                    </div>

                </div>
                <div className="w-[70%] flex flex-col ">
                    <Outlet />
                </div>
            </div>
        </div>

    );
}