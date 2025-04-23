import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

function Login() {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );

      // Store token in localStorage
      localStorage.setItem("token", res.data.token);

      // Set user in global context
      setUser({
        token: res.data.token,
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
      });

      setLoading(false);
    } catch (err) {
      console.error("Login error:", err);

      // Display meaningful error messages
      if (err.response) {
        // Server responded with error
        if (err.response.status === 400) {
          setError(err.response.data.message || "Invalid email or password.");
        } else if (err.response.status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else {
          setError(
            err.response.data.message || "Login failed. Please try again."
          );
        }
      } else if (err.request) {
        // Request made but no response received
        setError(
          "Could not connect to server. Please check your internet connection."
        );
      } else {
        // Something else caused the error
        setError("Login failed. Please try again.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 min-h-[80vh]">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="mb-6 sm:mb-8 md:mb-10 text-center">
          <h1 className=" font-bold text-gray-900 mb-2 sm:mb-3">
            Artist Portal
          </h1>
          <div className="w-12 sm:w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl text-center font-semibold text-gray-800 mb-4 sm:mb-6">
            Sign in to your account
          </h2>

          {error && (
            <div className="mb-4 sm:mb-6 px-3 sm:px-4 py-2 sm:py-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-center">
              <FiAlertCircle className="mr-2 text-red-500" size={16} />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="text-black w-full pl-10 px-1 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200 hover:border-indigo-300"
                  placeholder="Your email address"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm text-indigo-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="text-black w-full pl-11 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200 hover:border-indigo-300"
                  placeholder="Your password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEye className="text-gray-500" size={16} />
                  ) : (
                    <FiEyeOff className="text-gray-500" size={16} />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center">
                  <FiLoader className="animate-spin mr-2" size={16} />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
