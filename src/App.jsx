import { Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MainDashboard from "./pages/MainDashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<MainDashboard />} />
    </Routes>
  );
}

export default App;
