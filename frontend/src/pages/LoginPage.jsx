import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser, login } = useContext(AuthContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    try {
      const user = await login(username, password);   // calls /api/token/ then /api/auth/me/
      console.log("Logged in user:", user);
      setUser(user);                                   // store user in global context
      if (user.profile?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/main");
      }                               // redirect
    } catch (err) {
      alert("Invalid credentials")
    }
  }

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
              <button className="btn" onClick={handleLogin}>
                login
              </button>

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
