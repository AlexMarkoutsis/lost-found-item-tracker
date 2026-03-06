import axios from "axios";

// Axios instance
const items = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000", // fallback
  headers: {
    "Content-Type": "application/json",
  },
});

// Login function: sends username & password to /items/token/
export async function login(username, password) {
  try {
    const response = await items.post("/items/token/", {
      username,
      password,
    });
    console.log("Login successful. Token data:", response.data);

    // Example: storing tokens in localStorage (optional)
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);

    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
}

// Optional: helper to include JWT in future requests
export function authAxios(accessToken) {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export default items;
