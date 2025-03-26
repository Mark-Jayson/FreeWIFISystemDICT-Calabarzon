import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-6 font-montserrat">
        <img
            src="/logo.webp"
            alt="DICT Logo"
            className="w-64 mx-auto mb-4 fixed top-6"
        />

        <div className="w-full max-w-md p-8 bg-white shadow-md mt-24">
            <h2 className="text-2xl font-bold text-center text-gray-900">Sign up</h2>

            <form className="mt-6">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm "
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm  "
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm "
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center "
                        onClick={() => setShowPassword(!showPassword)}
                    >
                    </button>
                </div>

                <button className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                    Sign Up
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

        <footer className="w-full fixed bottom-6 bg-gray-100 text-gray-600 text-sm">
            <div className="max-w-6xl mx-auto">
                <div className="border-gray-700 mt-6 pt-6 text-center text-gray-600 text-xs">
                    <p>This website is for official use only. Unauthorized access is prohibited.</p>
                </div>
            </div>
        </footer>
    </div>
);
};


export default Signup;
