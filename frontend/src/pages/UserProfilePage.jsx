import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import default_pfp from "../assets/default_pfp.svg"

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
          console.log("User profile fetch data failed: " + err);
      }
  }
  if (!profile)
  {
      return <p>No such profile found...</p>;
  }

  var testDescription = "Student at UWM aiming to major in CompSci. \n " +
      "If you happen to find a [description of item] contact me at: \n" +
      "[Links can go here, if users want to add other ways to reach them.]";

  return (
    <div className="upp_main">
      <div className="upp_pfp_cont">
          <img className="upp_pfp" src={default_pfp} alt="pfp" />
          <div className="upp_name_desc">
            <h1>{profile.display_name}</h1>
            <p>{testDescription}</p>
          </div>
      </div>
      <p>User link ID: {profile.user}</p>
      <div className="upp_items_posted_main">
          Items posted:
          <hr/>
          <div className="upp_items_posted_cont">

          </div>
      </div>
    </div>
  );
}

export default UserProfilePage;