import { Link } from "react-router-dom";

const Login = () => {
  <h1 className="text-2xl font-bold text-center text-red-600">Login Page</h1>

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 font-montserrat">
      <img
        src="/logo.webp"
        alt="DICT Logo"
        className="w-64 mx-auto mb-4 fixed top-6"
      />
      
      <div className="w-full max-w-md p-8 bg-white shadow-md mt-20">
        <h2 className="text-2xl font-bold text-center text-gray-900">Log In</h2>
        <form className="mt-4">
          <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg" />
          <input type="password" placeholder="Password" className="w-full p-3 mt-3 border border-gray-300 rounded-lg" />
          <button className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Log In</button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
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

export default Login;
