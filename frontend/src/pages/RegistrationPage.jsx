import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import pantherFind from '../assets/PantherFind.png';
import "./RegistrationPage.css"

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const mismatch =
    password.length > 0 &&
    rePassword.length > 0 &&
    password !== rePassword;

  const canSubmit = username.trim() && password && !mismatch;

  async function handleRegister() {
      console.log("USER: " + username.trim());
    try {
      const response = await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
          password2: rePassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.username) {
          alert(data.username[0]);
        } else {
          alert(data.error || "Registration failed");
        }
        console.log("Registration FAIL");
        return;
      }

      // Registration succeeded > now log the user in
      await login(username.trim(), password);

      navigate("/main");

    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong during registration.");
    }
  }

  return (
    <div className="screen">
      <div className="page">
        <div className="rp-frame">
            <div className="rp-title-box">
                <img className="rp-title-img" src={pantherFind}/>
            </div>
            <div className="rp-sign-up">Register for an account</div>

            <label className="rp-username-field rp-field">
              <span className="rp-username-label rp-label">Username</span>
              <input
                className="rp-username-input rp-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=""
                autoComplete="username"
              />
            </label>

            <label className="rp-password-field rp-field">
              <span className="rp-password-label rp-label">Password</span>
              <input
                className="rp-password-input rp-input"
                value={password}
                onChange={(e) => {console.log(e);setPassword(e.target.value)}}
                placeholder=""
                type="password"
                autoComplete="new-password"
              />
            </label>

            <label className="rp-repassword-field rp-field">
              <span className="rp-repassword-label rp-label">Re-Password</span>
              <input
                className="rp-repassword-input rp-input"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder=""
                type="password"
                autoComplete="new-password"
              />
            </label>

            {mismatch && <p className="error">Passwords do not match.</p>}

            <div className="rp-reg-log-cont">
              <button
                className="rp-reg-btn"
                disabled={!canSubmit}
                onClick={handleRegister}
              >
                Create and Login
              </button>
              <div className="rp-sign-in-cont">
                    Already have an account?
                    <Link className="rp-sign-in-link" to="/login">Sign in</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}