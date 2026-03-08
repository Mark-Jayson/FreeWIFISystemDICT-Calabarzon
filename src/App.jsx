import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MainDashboard from "./pages/MainDashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./pages/Layout.jsx";
import AddWifiSitePage from "./pages/AddWifiSitePage.jsx";
import WiFiList from "./pages/WiFiList.jsx";
import Coordinate from "./pages/Other.jsx";

// Redirects to /login if user is not in localStorage
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* All protected routes require authentication */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<MainDashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<MainDashboard />} />
          <Route path="wifi" element={<WiFiList />} />
          <Route path="playground" element={<Coordinate />} />
          <Route path="add-wifi-site" element={<AddWifiSitePage />} />
        </Route>

        {/* Catch-all: redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
