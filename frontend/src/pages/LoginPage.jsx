import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setCurrentUser } = useContext(AppContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="screen">
      <div className="page">
        <div className="page__title">Login Page</div>

        <div className="frame">
          <div className="frame__inner">
            <div className="title-box">PantherFind</div>

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
                autoComplete="current-password"
              />
            </label>

            <div className="button-col">
              {/* Login button -> Main Page*/}
              <button
                className="btn"
                onClick={async () => {
                  const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({username, password}),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    setCurrentUser(data.user || username);
                    navigate('/main');
                  } else {
                    alert(data.error || "Login failed");
                  }
                }}
              >
                login
              </button>
              {/* Register Button -> Registration Page*/}
              <button className="btn" onClick={() => navigate('/register')}>
                register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
