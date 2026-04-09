import default_pfp from "../assets/default_pfp.svg"
import "./NavBar.css"
import PantherFindLogo from "../assets/PantherFind.png"
import {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function NavBar()
{
    const navigate = useNavigate()
  const handleLogoClick = () => {
    navigate('/main/');
  };

    return (
        <div className="navbar">
            <div className="navbar-contents">
                <div className="pantherfind_logo_cont">
                    <img className="pantherfind_logo" src={PantherFindLogo} onClick={handleLogoClick} alt="pantherfind_logo"/>
                </div>
            </div>
        </div>
    );
}