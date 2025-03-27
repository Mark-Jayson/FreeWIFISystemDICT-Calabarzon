import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";

import LandingPage from "./pages/LandingPage"; // Ensure this file exists
import InfoPanel from "./components/InfoPanel";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);


  return (
    <div className="relative">
      {/* Define Routes for navigation */}
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Default route */}
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sidebar" element={<Sidebar />} />
      </Routes>
    </div>

  );
}

export default App;

