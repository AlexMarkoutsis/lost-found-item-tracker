import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LostItems from "./pages/LostItems";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lost-items" element={<LostItems />} />
      </Routes>
    </Router>
  );
}

export default App;
