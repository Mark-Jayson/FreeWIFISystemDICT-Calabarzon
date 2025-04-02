import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await axios.post("http://localhost:5000/api/signup", formData);
            console.log("Registration successful:", response.data);
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Registration failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-6 font-montserrat">
            <img
                src="/logo.webp"
                alt="DICT Logo"
                className="w-64 mx-auto mb-4 fixed top-6"
            />

            <div className="w-full max-w-md p-8  bg-white shadow-md mt-24 rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">Sign up</h2>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form className="mt-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 border-t border-gray-300"></div>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 font-semibold">
                        Log In
                    </Link>
                </p>
            </div>

            <footer className="w-full text-gray-600 text-sm py-4 fixed bottom-0 bg-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="border-gray-700 pt-4 text-center text-gray-600 text-xs">
                        <p>This website is for official use only. Unauthorized access is prohibited.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Signup;