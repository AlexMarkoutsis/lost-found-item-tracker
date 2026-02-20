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
                onClick={() => {
                  setCurrentUser(username?.trim() ? username.trim() : 'Username')
                  navigate('/main')
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
