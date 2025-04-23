import { Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MainDashboard from "./pages/MainDashboard.jsx";

function App() {
  return (
    <Routes>

      <Route path="/" element={<MainDashboard />} />
    </Routes>
  );
}

export default App;
