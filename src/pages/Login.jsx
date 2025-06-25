import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError("");

  try {
    const response = await axios.post("http://localhost:5000/api/login", formData);
    
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(response.data.user));

    navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.error || "Login failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 font-montserrat">
      <img
        src="/logo.webp"
        alt="DICT Logo"
        className="w-64 mx-auto mb-4 fixed top-6"
      />

      <div className="w-full max-w-md p-8 bg-white shadow-md mt-20">
        <h2 className="text-2xl font-bold text-center text-gray-900">Log In</h2>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form className="mt-4" onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email" 
            className="w-full p-3 border border-gray-300 rounded-lg" 
            required
          />
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password" 
            className="w-full p-3 mt-3 border border-gray-300 rounded-lg" 
            required
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
        </p>
      </div>

      <footer className="w-full bottom-6 bg-gray-100 text-gray-600 text-sm">
        <div className="max-w-6xl mx-auto">
          <div className="border-gray-700 mt-6 pt-6 text-center text-gray-600 text-xs">
            <p>This website is for official use only. Unauthorized access is prohibited.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;