import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MainDashboard from "./pages/MainDashboard.jsx";
import Layout from "./pages/Layout.jsx";
import AddWifiSitePage from "./pages/AddWifiSitePage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication routes */}
        {/* <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        
        {/* Application routes with Layout */}
        {/* <Route path="/" element={<Layout />}> */}
          <Route path="/" element={<MainDashboard />} />
          <Route path="map" element={<MainDashboard />} />
          <Route path = "dashboard" element={<MainDashboard />} />
          <Route path="wifi" element={<MainDashboard />} />
          <Route path="add-wifi-site" element={<AddWifiSitePage />} />
          <Route path="settings" element={<MainDashboard />} />
        {/* </Route> */}
      </Routes>
    </Router>
  );
}

export default App;