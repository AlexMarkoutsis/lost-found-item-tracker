import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App.jsx'

export default function RegistrationPage() {
  const navigate = useNavigate()
  const { setCurrentUser } = useContext(AppContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const mismatch = password.length > 0 && rePassword.length > 0 && password !== rePassword

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
                onClick={async () => {
                  try {
                    const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
                      method: "POST",
                      headers: {"Content-Type": "application/json"},
                      body: JSON.stringify({
                        username: username.trim(),
                        password: password
                      }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                      setCurrentUser(data.username);
                      navigate('/main');
                    } else {
                      if (data.username) {
                        alert(data.username[0]); // "Username is already taken."
                        } else {
                        alert(data.error || "Registration failed");
                      }
                    }
                  } catch (err) {
                    console.error("Registration error:", err);
                    alert("Something went wrong during registration.");
                  }
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
