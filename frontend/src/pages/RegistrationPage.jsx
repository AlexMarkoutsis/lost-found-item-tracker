import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App.jsx'
import items from "../items.js";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants.js";

export default function RegistrationPage() {
  const navigate = useNavigate()
  const { setCurrentUser } = useContext(AppContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const mismatch = password.length > 0 && rePassword.length > 0 && password !== rePassword

  const [loading, setLoading] = useState(false)
  const handleCreate = async (e) => {
        setLoading(true)

        // e.preventDefault()

        try{
            const res = await items.post("/register/", {username, password})
        }
        catch (error){
            alert(error)
            console.error("Full error:", error);
            if (error.response) {
                console.log("Backend response:", error.response.data);
                alert(JSON.stringify(error.response.data));
            } else {
  }
        }
        finally
        {
            setLoading(false)
        }
    }

  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Registration Page</div>

        <div className="frame">
          <div className="frame__inner">
            <div className="title-box">Create Account</div>

            <label className="field">
              <span className="field__label">Username</span>
              <input
                className="field__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
              />
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <input
                className="field__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                autoComplete="new-password"
              />
            </label>

            <label className="field">
              <span className="field__label">Re-Password</span>
              <input
                className="field__input"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Re-Password"
                type="password"
                autoComplete="new-password"
              />
            </label>

            {mismatch ? <p className="error">Passwords do not match.</p> : null}

            <div className="button-col">
              {/* Create and Login Button -> Main Page*/}
              <button
                className="btn"
                disabled={!username.trim() || !password || mismatch}
                onClick={() => {
                  setCurrentUser(username.trim())
                    handleCreate()
                  // navigate('/main')
                }}
              >
                Create and Login
              </button>

              {/* Back -> Login Page*/}
              <button className="btn" onClick={() => navigate('/login')}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
