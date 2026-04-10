import { useEffect, useState, useContext } from "react";
import { ACCESS_TOKEN } from "../constants";
import { AuthContext } from "../context/AuthContext"; // adjust path if needed

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext); // assumes user.role exists

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    fetch("/api/notifications/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error("Failed to load notifications:", err));
  }, []);

  function formatMessage(n, isAdmin) {
    if (n.notif_type === "item_posted") {
      return isAdmin
        ? `${n.actor_username} posted an item: ${n.item_title}`
        : `You posted an item: ${n.item_title}`;
    }

    if (n.notif_type === "item_claimed") {
      return isAdmin
        ? `${n.actor_username} claimed the item: ${n.item_title}`
        : `Your item was claimed: ${n.item_title}`;
    }

    return n.notif_type; // fallback
  }

  const isAdmin = user?.profile.role === "admin";

  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Notifications</div>

        <div className="frame frame--wide">
          <div className="frame__inner">
            {notifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="notif-item">
                  <div className="notif-message">
                    {formatMessage(n, isAdmin)}
                  </div>
                  <div className="notif-date">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
