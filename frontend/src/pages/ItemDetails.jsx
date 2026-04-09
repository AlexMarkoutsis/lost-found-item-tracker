import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ItemDetails() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const item = location.state?.item;

  if (!item) {
    return (
      <div className="screen">
        <div className="page">
          <div className="page__title">Item Details</div>
          <p>No item data was provided.</p>
          <button className="btn" onClick={() => navigate("/main")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Item Details</div>

        <div className="frame frame--wide">
          <div className="frame__inner">
            <div className="main-header">
              <div className="main-header__left">PantherFind</div>
              <div className="main-header__right">
                ({user?.username || "Guest"})
              </div>
            </div>

            <div className="main-body">
              <label>Item Name: {item.title}</label><br />
              <label>Description: {item.description}</label><br />
              <label>Category: {item.category_name}</label><br />
              <label>Location Found: {item.location}</label><br />
              <label>Date Found: {item.date_reported}</label><br />
              <label>Reported By: {item.reporter_username}</label><br />
              <label>Status: {item.status}</label>
            </div>

            <div className="button-col">
              <button
                className="btn btn--secondary"
                type="button"
                onClick={() => navigate("/main")}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
