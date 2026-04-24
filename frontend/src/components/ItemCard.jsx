import categoryIcon from "../assets/category.svg"
import locationIcon from "../assets/location.png"
import dateFoundIcon from "../assets/dateFound.svg"
import noImage from "../assets/noImage.png"
import PantherFindLogo from "../assets/PantherFind.png"
import {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import "./ItemCard.css"
import {API_URL} from "../constants"
import {ACCESS_TOKEN} from "../constants.js";
import ItemInfo from "./ItemInfo.jsx"




export default function ItemCard({item})
{
    const navigate = useNavigate();

const [itemInfoOpen, setItemInfoOpen] = useState(false);

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


const imgPath = item?.image ? `${API_URL}${item?.image}` : noImage;
 console.log(item);
    return (
        <>
            <ItemInfo editing={itemInfoOpen} onClose={()=>{setItemInfoOpen(false)}} item={item}/>
            <div className="ic-item-card" onClick={() => setItemInfoOpen(true)}>
                <div className="ic-img-cont">
                    <div className="ic-location-cont">
                            <img className="ic-location-icon" src={locationIcon}/>
                            {item?.location}
                    </div>
                    <img className="ic-img" src={imgPath}/>
                </div>

                <div className="ic-details-cont">
                    <div className="ic-title">{item?.title}</div>
                    <div className="ic-description-cont">
                        <div className="ic-description">{item?.description}</div>
                    </div>

                    <div className="ic-info">
                        <div className="ic-category-cont">
                            <img className="ic-category-icon" src={categoryIcon}/>
                            {item?.category_name}
                        </div>

                        <div className="ic-date-reported-cont">
                            <img className="ic-date-reported-icon" src={dateFoundIcon}/>
                            {item?.date_reported}
                        </div>
                    </div>
                    {item?.status !== "claimed" && (<div className="ic-claim-cont">
                        <button className="ic-claim-btn" onClick={(e) => {
                                  e.stopPropagation();
                                  handleClaim();
                                }}>Claim Item</button>
                    </div>)}


                </div>
            </div>
        </>
    );
}