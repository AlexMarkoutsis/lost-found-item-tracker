import { useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../App.jsx'

export default function ItemDetails() {
    const navigate = useNavigate();
    const {currentUser} = useContext(AppContext);
    const location = useLocation();
    const item = location.state.item;

    return (
        <div className='screen'>
            <div className='page'>
                <div className="page__title">Item Details</div>

                <div className="frame frame--wide">
                    <div className="frame__inner">
                        <div className="main-header">
                            <div className="main-header__left">PantherFind</div>
                            <div className="main-header__right">({currentUser})</div>
                        </div>

                        <div className="main-body">
                            <label>Item Name: {item.title || item.itemName}</label><br />
                            <label>Description: {item.description}</label><br />
                            <label>Category: {item.category}</label><br />
                            <label>Location Found: {item.location}</label><br />
                            <label>Date Found: {item.dateFound}</label><br />
                            <label>Reported By: </label><br />
                            <label>Status: </label>
                        </div>

                        <div className="button-col">
                            <button className="btn btn--secondary" type="button" onClick={() => navigate('/main')}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}