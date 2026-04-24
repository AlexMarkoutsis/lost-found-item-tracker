import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import ReactDom from 'react-dom';
import {API_URL} from '../constants'
import './ItemInfo.css'
import {ACCESS_TOKEN} from '../constants.js'
import { AuthContext } from '../context/AuthContext'
import editIcon from '../assets/pencilEdit.svg'
import chatIcon from '../assets/msg.svg'
import itemIcon from '../assets/item.svg'
import descriptionIcon from '../assets/description.svg'
import categoryIcon from '../assets/category.svg'
import locationIcon from '../assets/location.png'
import dateFoundIcon from '../assets/dateFound.svg'
import statusIcon from '../assets/status.svg'
import claimIcon from '../assets/claim.svg'

export default function ItemInfo({editing, onClose, item}){
    if(!editing) {return null;}
    const [reporterProfile, setReporterProfile] = useState(null)
    const {profile, user} = useContext(AuthContext);
    const navigate = useNavigate()

    async function handleClaim() {
    const access_token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await fetch(`/api/items/${item.id}/claim/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to claim item");
        return;
      }

      alert("Item claimed successfully!");

      // Refresh items list
      const refreshed = await fetch("/api/items/?status=found");
      const newData = await refreshed.json();
      setItems(newData);

    } catch (err) {
      console.error("Claim failed:", err);
      alert("Something went wrong.");
    }
  }

    useEffect(() => {
    const fetchReporter = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${item.reporter}/`);
        if (!res.ok) throw new Error("Failed to fetch reporter");

        const data = await res.json();
        setReporterProfile(data);
      } catch (err) {
        console.error("Reporter fetch failed:", err);
      }
    };

    fetchReporter();
  }, [item]);

const isOwner =
  reporterProfile && profile &&
  item?.reporter_username === user?.username;

    return ReactDom.createPortal(
        <>
          <div className='ii-backdrop'>
              <div className="ii-cont">
                    <div className="ii-panel-cont">
                        <div className="ii-header-cont">
                            <button className="ii-exit-btn" onClick={()=> onClose()}>
                            ← Exit
                            </button>
                            <div className="ii-header">
                                Item Details
                            </div>
                        </div>
                        <div className="ii-panel">
                            <div className="ii-panel-header">
                                <div className="ii-title">
                                    <img className="ii-title-icon" src={itemIcon}/>
                                    {item?.title}
                                </div>
                                <div className="ii-profile-cont">
                                    <div className="ii-profile">
                                        <img className="ii-avatar" src={`${API_URL}${reporterProfile?.avatar}`}/>
                                        <div className="ii-names">
                                            <div className="ii-display_name">
                                                {reporterProfile?.display_name}
                                            </div>
                                            <div className="ii-username">
                                                @{item?.reporter_username}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="ii-profile-message" onClick={() => navigate("/messages")}>
                                        <img className="ii-profile-message-icon" src={chatIcon}/>
                                        <span>Message</span>
                                    </button>
                                </div>
                            </div>

                            <div className="ii-info">
                                <div className="ii-description">
                                    <div className="ii-description-header">
                                        <img className="ii-description-icon" src={descriptionIcon}/>
                                        Description
                                    </div>
                                    <div className="ii-description-contents">
                                        {item?.description}
                                    </div>
                                </div>

                                <div className="ii-sub-info">
                                    <div className="ii-category">
                                        <div className="ii-category-header">
                                            <img className="ii-category-icon" src={categoryIcon}/>
                                            Category
                                        </div>
                                        {item?.category_name}
                                    </div>
                                    <div className="ii-location">
                                        <div className="ii-location-header">
                                            <img className="ii-location-icon" src={locationIcon}/>
                                            Location
                                        </div>
                                        {item?.location}
                                    </div>
                                    <div className="ii-date-reported">
                                        <div className="ii-date-reported-header">
                                            <img className="ii-date-reported-icon" src={dateFoundIcon}/>
                                            Date Found
                                        </div>
                                        {item?.date_reported}
                                    </div>
                                    <div className="ii-status">
                                        <div className="ii-status-header">
                                            <img className="ii-status-icon" src={statusIcon}/>
                                            Status
                                        </div>
                                        {item?.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isOwner ?
                            (<div className="ii-edit-item">
                                <button className="ii-edit-item-btn" onClick={() => navigate("/edit-item", {state: {item, from: 'main'}})}>
                                    <img className="ii-edit-item-icon" src={editIcon}/>
                                    Edit item info
                                </button>
                            </div>) : (
                                <div className="ii-claim-item">
                                <button className="ii-claim-item-btn" onClick={handleClaim}>
                                    <img className="ii-claim-item-icon" src={claimIcon}/>
                                    Claim item
                                </button>
                            </div>)
                                }

                    </div>

                    <div className="ii-img-cont">
                        <img className="ii-img" src={`${API_URL}${item?.image}`}/>
                    </div>
              </div>
          </div>
        </>,
        document.getElementById(`item-info-portal`)
        )
}