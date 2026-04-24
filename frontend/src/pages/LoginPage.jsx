import { useContext, useState } from 'react'
import { useNavigate, Link} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import pantherFind from '../assets/PantherFind.png'
import "./LoginPage.css"

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
        <div className="lp-frame">
            <div className="lp-title-box">
                <img className="lp-title-img" src={pantherFind}/>
            </div>
            <div className="lp-sign-in">Sign into an account</div>
            <label className="lp-username-field">
              <span className="lp-username-label">Username</span>
              <input
                className="lp-username-input"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="lp-password-field">
              <span className="lp-password-label">Password</span>
              <input
                className="lp-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                type="password"
                autoComplete="current-password"
              />
            </label>

            <div className="lp-log-reg-cont">
              <button className="lp-log-btn" onClick={handleLogin}>
                Log in
              </button>

                <div className="lp-sign-up-cont">
                    Don't have an account?
                    <Link className="lp-sign-up-link" to="/register">Sign up</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
