import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
    try {
      const response = await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.username) {
          alert(data.username[0]);
        } else {
          alert(data.error || "Registration failed");
        }
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

            {mismatch && <p className="error">Passwords do not match.</p>}

            <div className="button-col">
              <button
                className="btn"
                disabled={!canSubmit}
                onClick={handleRegister}
              >
                Create and Login
              </button>

              <button
                className="btn btn--secondary"
                onClick={() => navigate("/login")}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}