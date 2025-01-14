import { Button } from "@nextui-org/react";
import { Link, Outlet } from "react-router-dom";

export default function Profile() {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow flex">
                {/* Left Panel */}
                <div
                    className="w-[30%] bg-gray-100 flex flex-col justify-center items-center gap-12 sticky top-0"
                    style={{ height: '100vh' }}
                >
                    <img src="/images/user.png" alt="Example" className="rounded-full w-80 h-80" />
                    <div className="flex flex-col items-center gap-4">
                        <Link to="submission_history">
                            <Button variant="outlined">
                                <p className="text-xl">Submission History</p>
                            </Button>
                        </Link>
                        <Link to="review_history">
                            <Button variant="outlined">
                                <p className="text-xl">Review History</p>
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* Right Content */}
                <div className="w-[70%] flex flex-col overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
