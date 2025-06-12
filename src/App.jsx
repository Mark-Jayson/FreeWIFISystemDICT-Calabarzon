import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MainDashboard from "./pages/MainDashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./pages/Layout.jsx";
import AddWifiSitePage from "./pages/AddWifiSitePage.jsx";
import WiFiList from "./pages/WiFiList.jsx";
import OtherPage from "./pages/Other.jsx";


function App() {
  return (
    <Router>
      <Routes>
        {/* Optional: Auth routes without sidebar */}
        <Route index element={<Login />} />
         <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 

        {/* Routes with sidebar and layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<MainDashboard />} /> {/* "/" default route */}
    
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<MainDashboard />} />
          <Route path="wifi" element={<WiFiList />} />
          <Route path="playground" element={<OtherPage />} />
          <Route path="add-wifi-site" element={<AddWifiSitePage />} />
          <Route path="logout" element={<MainDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;