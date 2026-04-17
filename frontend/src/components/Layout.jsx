import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";

export default function Layout() {
  return (
    <div className="app-shell">
        <NavBar />
        <Outlet />
    </div>
  );
}