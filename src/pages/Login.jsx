import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Simulated API call
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      const data = await response.json();
      
      // Store user data in component state instead of localStorage
      console.log("Login successful:", data.user);
      
      // Navigate to dashboard (simulated)
      alert("Login successful! Redirecting to dashboard...");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = `
    .bg-gray-100 { background-color: rgb(243, 244, 246) !important; }
    .bg-white { background-color: rgb(255, 255, 255) !important; }
    .text-gray-900 { color: rgb(17, 24, 39) !important; }
    .text-gray-600 { color: rgb(75, 85, 99) !important; }
    .text-gray-700 { color: rgb(55, 65, 81) !important; }
    .bg-red-100 { background-color: rgb(254, 226, 226) !important; }
    .text-red-700 { color: rgb(185, 28, 28) !important; }
    .border-gray-300 { border-color: rgb(209, 213, 219) !important; }
    .border-gray-700 { border-color: rgb(55, 65, 81) !important; }
    .bg-blue-600 { background-color: rgb(37, 99, 235) !important; }
    .bg-blue-700 { background-color: rgb(29, 78, 216) !important; }
    .bg-blue-400 { background-color: rgb(96, 165, 250) !important; }
    .text-white { color: rgb(255, 255, 255) !important; }
    .text-blue-500 { color: rgb(59, 130, 246) !important; }
    .hover\\:bg-blue-700:hover { background-color: rgb(29, 78, 216) !important; }
    .disabled\\:bg-blue-400:disabled { background-color: rgb(96, 165, 250) !important; }
  `;

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 font-sans">
        <img
          src="/logo.webp"
          alt="DICT Logo"
          className="w-64 mx-auto mb-4 fixed top-6"
        />

        <div className="w-full max-w-md p-8 bg-white shadow-md mt-20 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900">Log In</h2>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mt-4">
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
            />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password" 
              className="w-full p-3 mt-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
            />
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </div>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <span className="text-blue-500 cursor-pointer hover:underline">Sign up</span>
          </p>
        </div>

        <footer className="w-full mt-8 bg-gray-100 text-gray-600 text-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-600 text-xs">
              <p>This website is for official use only. Unauthorized access is prohibited.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;