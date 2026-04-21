import {createContext, useState} from "react";
import {useEffect} from "react";
import {API_URL} from "../constants"

export const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function init() {
      const loaded = await loadUser();
      if (loaded) setUser(loaded);

      const prof = await loadProfile();
      if (prof) setProfile(prof);
    }
    init();
  }, []);


  async function login(username, password) {
    const response = await fetch("/api/token/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, password}),
    });

    if (!response.ok) throw new Error("Invalid credentials");

    const data = await response.json();

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const loadedUser = await loadUser();
    setUser(loadedUser);

    const loadedProfile = await loadProfile();
    setProfile(loadedProfile);

    return loadedUser;
  }

  async function loadUser() {
    const token = localStorage.getItem("access");
    if (!token) return null;

    const response = await fetch("/api/auth/me/", {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (!response.ok) {
      const refreshed = await refreshToken();
      if (!refreshed) return null;
      return await loadUser();
    }

    return await response.json();
  }

    async function loadProfile(){
        const token = localStorage.getItem("access");
    if (!token) return null;
        const user = await loadUser();

        const res = await fetch(`${API_URL}/api/users/${user.id}/`, {
      headers: {Authorization: `Bearer ${token}`},
    });
        if (!res.ok) {
      const refreshed = await refreshToken();
      if (!refreshed) return null;
      return await loadProfile();
    }

        return await res.json();

    }

  async function refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return false;

    const response = await fetch("/api/token/refresh/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({refresh}),
    });

    if (!response.ok) {
      logout();
      return false;
    }

    const data = await response.json();
    localStorage.setItem("access", data.access);
    return true;
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{user, profile, setUser, login, logout, loadUser}}>
      {children}
    </AuthContext.Provider>
  );
}
