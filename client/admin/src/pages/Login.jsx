import React, { useState } from "react";
import api from "../utils/api";
import { FiAlertCircle, FiLoader } from "react-icons/fi";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Check if the user is an admin
      if (response.data.user.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", response.data.token);

      // Verify the token works by making a test request
      try {
        await api.get("/admin/dashboard");
        setIsAuthenticated(true);
      } catch (verifyErr) {
        setError("Authentication failed. Please try again.");
        localStorage.removeItem("adminToken");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          {/* Logo placeholder */}
          <div className="flex justify-center mb-2 sm:mb-3"></div>
          <h1 className="text-2xl sm:text-2xl md:text-3xl font-extrabold">
            ArtMe Admin
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-5 md:space-y-6"
        >
          {error && (
            <div className="p-3 sm:p-4 text-xs sm:text-sm text-white bg-red-500 rounded-md shadow-sm">
              <div className="flex items-center">
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="mt-1">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                placeholder="admin@artme.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs font-medium text-gray-700 hover:text-gray-900 underline"
              >
                Forgot?
              </a>
            </div>
            <div className="mt-1">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white transition-colors duration-200 bg-gray-700 hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <FiLoader className="animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-600">
            ArtMe Administration Portal &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
