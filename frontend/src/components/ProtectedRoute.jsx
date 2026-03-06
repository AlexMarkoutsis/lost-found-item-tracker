import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, setUser, loadUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

    if (user === null && !localStorage.getItem("access")) {
    return <Navigate to="/login" replace/>;
  }

  useEffect(() => {
  const token = localStorage.getItem("access");
  if (!token) {
    setLoading(false);
    return;
  }

  async function verify() {
    if (!user) {
      const loaded = await loadUser();
      setUser(loaded);
    }
    setLoading(false);
  }

  verify();
}, [user, setUser, loadUser]);


  if (loading) return <div>Loading...</div>;

  const token = localStorage.getItem("access");
  if (!token) return <Navigate to="/login" replace />;

  return children;
}
