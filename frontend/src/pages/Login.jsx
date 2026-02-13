import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export async function clientLoader() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return redirect("/")
    }

    const { data } = await getProfile();

    return { profile: data };

  } catch {
    localStorage.removeItem("accessToken");
    return redirect("/");
  }
}


export async function clientAction({request}) {
  try {
    const formData = await request.formData();
    const type = formData.get("type");
    const email = formData.get("email");
    const password = formData.get("password");

    const response =
      type === "register"
        ? await register({email, password})
        : await login({email, password});

    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return redirect("/");
  } catch (error) {
    return {
      error: error?.response?.data?.message || error.message,
    };
  }
}



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {email, password});
      localStorage.setItem("token", response.data.access);
    }
    catch (error) {
      console.error("login fialed: ", error.response.data);
    }


    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");

      navigate("/lost-items");
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
