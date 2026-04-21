import chatIcon from "../assets/chatIcon.svg"
import bellIcon from "../assets/bell.svg"
import addIcon from "../assets/add.svg"

import "./NavBar.css"
import PantherFindLogo from "../assets/PantherFind.png"
import {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import {API_URL} from "../constants"

export default function NavBar()
{
    const {user, profile} = useContext(AuthContext)
    const navigate = useNavigate()

    return (
        <div className="nb-navbar">
            <div className="nb-contents">
                <div className="nb-pantherfind-logo_cont">
                    <img className="nb-pantherfind-logo" src={PantherFindLogo} onClick={() => {navigate('/main/')}} alt="pantherfind_logo"/>
                </div>
                <div className="nb-actions">
                    <button className="nb-post-item-btn" onClick={() => navigate('/submit')}>
                        <img className="nb-post-item-img" src={addIcon} />
                        <div className="nb-post-item">Post Item</div>
                    </button>
                    <div className="nb-notifications-cont">
                        <img className="nb-notifications" src={bellIcon}
                        onClick={() => navigate("/notifications")}/>
                    </div>
                    <div className="nb-messages-cont">
                        <img className="nb-messages" src={chatIcon}
                        onClick={() => navigate("/messages")}/>
                    </div>
                    <div className="nb-profile">
                        <div className="nb-avatar-cont">
                            <img className="nb-avatar" src={`${API_URL}${profile?.avatar}`}
                                onClick={()=> {navigate(`/users/${user.id}`)}}/>
                        </div>
                        <div className="nb-display-name">{profile?.display_name}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}