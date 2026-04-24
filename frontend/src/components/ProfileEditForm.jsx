import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ReactDom from 'react-dom'
import {API_URL} from '../constants'
import './ProfileEditForm.css'
import {ACCESS_TOKEN} from '../constants.js'
import { AuthContext } from '../context/AuthContext'
import editIcon from '../assets/editIcon.svg'


export default function ProfileEditForm({editing, onClose}){

const { id } = useParams();
const [imageFile, setImageFile] = useState(null);

const { user, profile} = useContext(AuthContext)
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(true);

useEffect(() => {
      setBio(profile.description);
      setDisplayName(profile.display_name);
      setImageFile(API_URL + profile.avatar);
  }, []);

const onImgInputSet = (e) =>{
        const img = e.target.files[0];
        setImageFile(URL.createObjectURL(img))
        setSaveDisabled(false);
    }

const handleCancel = () =>{
    onClose();
}

let avatarInput = document.querySelector('#avatarInput')
 const handleSaveEdits = async (e) => {
     e.preventDefault();
     let newAvatar = avatarInput.files[0]
     let formData = new FormData();
     if (newAvatar != null){
         formData.append('avatar', newAvatar);
     } else {
         const res = await fetch(imageFile);
         const imgBlob = await res.blob();
         const imgFile = new File([imgBlob], 'newAva.jpg', {type: imgBlob.type});
        formData.append('avatar', imgFile);
        }
    try {
        const access_token = localStorage.getItem(ACCESS_TOKEN)
        const response = await fetch(`/api/users/${user.id}/edit/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify({
                display_name: displayName.trim(),
                description: bio.trim(),
                    }),
                  });


        const postAvatar = await fetch(`/api/users/${user.id}/class-edit/`, {
            method:"POST",
            body: formData,
            });

        } catch (err) {
                  console.error("User profile edit error:", err);
                  alert("Something went wrong submitting edits.");
              }
        onClose();
        window.location.reload();
  };

if (!editing) { return null; }

    return ReactDom.createPortal(
        <>
          <div className='pef-backdrop'>
              <div className="pef-pef-container">
                    <div className="pef-pef">
                        <div className="pef-header">
                            Edit profile
                        </div>
                        <div className="pef-avatar-cont">
                            <img className="pef-avatar-edit-icon" src={editIcon}/>
                            <input className="pef-avatar-input" id="avatarInput" type="file" name="ava" onChange={onImgInputSet}/>
                            <label className="pef-avatar-img-label" htmlFor="avatarInput">
                                <img className="pef-avatar-img" src={imageFile}/>
                            </label>
                        </div>
                        <div className="pef-display-name-cont">
                            <input className="pef-display-name-input" defaultValue={displayName}  maxLength="50"
                                onChange={(e)=> {setDisplayName(e.target.value); setSaveDisabled(false);}}/>
                            <span className="pef-display-name-header">
                                Display Name
                            </span>
                        </div>
                        <div className="pef-bio-cont">
                            <span className="pef-bio-header">
                                Biography
                            </span>
                            <label className="pef-bio-panel">
                                <textarea className="pef-bio-input" defaultValue={bio} maxLength="600"
                                    onChange={(e)=> {setBio(e.target.value); setSaveDisabled(false);}}/>
                            </label>
                        </div>
                        <div className="pef-save-cancel-cont">
                            <div className="pef-save-cont">
                                <button className="pef-save" onClick={handleSaveEdits} disabled={saveDisabled}>Save to profile</button>
                            </div>
                            <div className="pef-cancel-cont">
                                <button className="pef-cancel" onClick={handleCancel}>Cancel edits</button>
                            </div>
                        </div>

                    </div>
              </div>
          </div>
        </>,
        document.getElementById(`profile-edit-form-portal`)
        )
}