import Listing from "../Listing/Listing";
import { useState } from "react";
import Navigbar from "../Navigbar/Navigbar";
export default function TeamPage() {
    const [team, setTeam] = useState('TeamName')
    return (
        <div>
            <div>
                <Navigbar />
            </div>
            <div style={{ backgroundColor: "#313232", padding: "20px", color: "#fff" }}>

                <div className="flex justify-center items-center text-4xl">
                    {team}
                </div>
                <div>
                    <Listing parameters={['id', 'username', 'name', 'email']} />
                </div>
            </div>
        </div>
    );
}