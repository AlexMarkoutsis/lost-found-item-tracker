import default_pfp from "../assets/default_pfp.svg"
import "./NavBar.css"
import PantherFindLogo from "../assets/PantherFind.png"
import {useContext, useEffect, useState} from "react"
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function NavBar() {
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    const handleLogoClick = () => {
        navigate('/main/');
    };

    const handlePfpClick = () => {
        if (!user) return;
        navigate(`/users/${user.id}`);
    };

    return (
        <div className="navbar">
            <div className="navbar-contents">
                <div className="pantherfind_logo_cont">
                    <img className="pantherfind_logo" src={PantherFindLogo} onClick={handleLogoClick} alt="pantherfind_logo"/>
                </div>

                <div className={"navbar-actions"}>
                    <button onClick={() => navigate("/messages")}>
                        Messages
                    </button>

                    <button onClick={() => navigate("/notifications")}>
                        Notifications
                    </button>

                    <img className={"navbar_pfp"} src={default_pfp} onClick={handlePfpClick} alt={"profile"}/>
                    <span className={"navbar-username"}>
                        {user ? `(${user.username})` : ""}
                    </span>
                </div>
            </div>
        </div>
    );
}