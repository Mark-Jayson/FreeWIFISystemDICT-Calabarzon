// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import MainDashboard from "./MainDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main Dashboard */}
        <Route path="/" element={<MainDashboard />} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
