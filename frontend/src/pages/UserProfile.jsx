import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import {ACCESS_TOKEN} from '../constants.js'
import msgIcon from "../assets/messageIcon.png"
import editIcon from "../assets/pencilEdit.svg"
import NavBar from "../components/NavBar.jsx"
import {API_URL} from "../constants"
import ProfileEditForm from "../components/ProfileEditForm"

import './UserProfile.css'

function UserProfilePage() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [numItemsPosted, setNumItemPosted] = useState(0);

const [activeTab, setActiveTab] = useState(0);
const toggleTab = (index) => {
    setActiveTab(index);
    }

  const fetchProfile = async () => {
      try {
          const res = await fetch(`${API_URL}/api/users/${id}/`);
          const data = await res.json();
          setProfile(data);
          setDescription(data.description);
          setDisplayName(data.display_name);

      } catch (err) {
          console.log("User profile fetch data failed: " + err);
      }
  }

  useEffect(() => {
      fetchProfile();

  }, []);

  const handleEditProfile = () => {
    setIsEditFormOpen(true);
  };

 const handleSaveEdit = async (e) => {
     e.preventDefault();
    setIsEditFormOpen(false);
    try {
        const access_token = localStorage.getItem(ACCESS_TOKEN)
        const response = await fetch(`/api/users/${user.id}/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify({
                display_name: displayName.trim(),
                description: description.trim(),
                    }),
                  });

              } catch (err) {
                  console.error("User profile edit error:", err);
                  alert("Something went wrong submitting edits.");
              }
  };



  if (!profile)
  {
      return <p>No such profile found...</p>;
  }
  return (
    <div className="upp-root">
      <NavBar className="upp-navbar"/>
      <div className="upp-page">
          <ProfileEditForm editing={isEditFormOpen} onClose={()=>setIsEditFormOpen(false)}/>
          <div className="content">
              <div className="profile">
                  <div className="profile-top">
                      <div className="pfp-cont">
                        <img className="pfp" src={`${API_URL}${profile.avatar}`} alt="avatar" />
                      </div>

                  </div>
                  <div className="profile-bottom">
                         <div className="display-name-cont">

                                <span className="display-name">{displayName}</span>

                         </div>

                          <div className="profile-actions">
                              <div className="upp-msg-cont">
                                  <button className="upp-msg-btn">
                                      <img className="upp-msg-icon" src={msgIcon} alt="avatar" />
                                      <span className="upp-send-msg">Send message</span>
                                  </button>
                              </div>
                          </div>
                       <div className="upp-bio-cont">
                           <div className="upp-bio">{description}</div>
                       </div>
                        <div className="stats-cont">
                          <div className="upp-stat-items-posted">
                              <span>Items posted:</span>
                              <span>53</span>
                          </div>
                          <div className="upp-stat-items-claimed">
                              <span>Items claimed:</span>
                              <span>95252</span>
                          </div>
                      </div>
                  </div>
                   <div className="edit-profile-cont">
                       <button className="edit-profile-btn" onClick={handleEditProfile}>
                           <img className="edit-profile-icon" src={editIcon} alt="editIcon"/>
                           <div className="edit-profile-txt">Edit profile</div>
                       </button>
                  </div>
              </div>



              <div className="upp-activities-cont">

                  <div className="upp-activities-tabs-cont">
                      <div className= {activeTab === 0 ? "upp-posted-items-tab active-tab" : "upp-posted-items-tab" }   onClick={()=>toggleTab(0)}>
                          <div className="upp-posted-items-tab-detail" style={{ opacity: activeTab === 0 ? '1' : '0' }}/>
                          <span className="upp-posted-items">Posted items</span>
                      </div>
                      <div className= {activeTab === 1 ? "upp-claimed-items-tab active-tab" : "upp-claimed-items-tab" } onClick={()=>toggleTab(1)} >
                          <div className="upp-claimed-items-tab-detail" style={{ opacity: activeTab === 1 ? '1' : '0' }}/>
                          <span className="upp-claimed-items">Claimed items</span>
                      </div>
                  </div>

                  <div className="upp-activities-panels">
                      <div className="upp-posted-items-panel" style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                          <div className="upp-no-posted-items-cont">
                              <span className="upp-no-posted-items">Currently there are no published items.</span>
                          </div>
                      </div>
                      <div className="upp-claimed-items-panel" style={{ display: activeTab === 1 ? 'block' : 'none' }}>
                          <div className="upp-no-claimed-items-cont">
                              <span className="upp-no-claimed-items">No items were claimed.</span>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </div>
    </div>
  );
}

export default UserProfilePage;