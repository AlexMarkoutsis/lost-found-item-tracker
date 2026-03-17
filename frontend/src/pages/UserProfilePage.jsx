import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import default_pfp from "../assets/default_pfp.svg";

function UserProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.log("User profile fetch failed:", err);
    }
  };

  if (!profile) {
    return <p>No such profile found...</p>;
  }

  // TODO: This should fix the linter yelling about unresolved variables, but is not for some reason
  const p = profile || {};

  return (
    <div className="upp_main">
      <div className="upp_pfp_cont">
        <img
          className="upp_pfp"
          src={p.avatar ? `http://127.0.0.1:8000${p.avatar}` : default_pfp}
          alt="pfp"
        />

        <div className="upp_name_desc">
          <h1>{p.display_name}</h1>
          <p>{p.bio || "This user has not added a bio yet."}</p>
        </div>
      </div>

      <p>User ID: {id}</p>
      <p>Preferred building: {p.preferred_building || "None"}</p>

      <div className="upp_items_posted_main">
        <h2>Stats</h2>
        <hr />
        <p>Items reported: {p.items_reported}</p>
        <p>Items claimed: {p.items_claimed}</p>
        <br></br>

        <h2>Notifications</h2>
        <hr />
          <p>Notify on match: {p.notify_on_match ? "Yes" : "No"}</p>
          <p>Notify on claim: {p.notify_on_claim ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}

export default UserProfilePage;
