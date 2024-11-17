import Navigbar from "../Navigbar/Navigbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <div className="h-[100vh] flex flex-col">
                <Navigbar />
                <div className="flex-grow">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
