import { Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MainDashboard from "./pages/MainDashboard.jsx";
import AddForm from "./components/AddForm.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<MainDashboard />} />
      <Route path="/add-location" element={
        <Layout>
          <AddForm />
        </Layout>
      } />
    </Routes>
  );
}

export default App;
