import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ArtworkForm from "./pages/ArtworkForm";
import Profile from "./pages/Profile";
import { jwtDecode } from "jwt-decode";
import "./App.css";

// Create auth context for global access
export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiring, setSessionExpiring] = useState(false);

  // Add axios interceptors to handle auth errors globally
  useEffect(() => {
    // Add request interceptor to add token to all requests
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle auth errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        // Check if token is expiring soon
        if (response.headers["x-token-expiring-soon"] === "true") {
          const expiresIn = parseInt(
            response.headers["x-token-expires-in"] || "3600"
          );
          // Show warning if token expires in less than 30 minutes
          if (expiresIn < 1800) {
            setSessionExpiring(true);
          }
        }
        return response;
      },
      (error) => {
        // Handle authentication errors
        if (error.response && error.response.status === 401) {
          const errorCode = error.response.data.code;
          if (errorCode === "TOKEN_EXPIRED" || errorCode === "INVALID_TOKEN") {
            // Clear token and redirect to login
            localStorage.removeItem("token");
            setUser(null);
            // Show specific error message
            alert(
              error.response.data.message ||
                "Your session has expired. Please log in again."
            );
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors on component unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check if token is valid on app load
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Decode token to check expiration
          const decoded = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp < currentTime) {
            // Token has expired
            localStorage.removeItem("token");
            setUser(null);
          } else {
            // Token is valid, extract user id from either decoded.id or decoded.user.id
            const userId = decoded.id || (decoded.user && decoded.user.id);

            if (!userId) {
              console.error("Could not extract user ID from token");
              localStorage.removeItem("token");
              setUser(null);
            } else {
              setUser({ token, id: userId });

              // Check if token will expire soon (< 30 minutes)
              if (decoded.exp - currentTime < 1800) {
                setSessionExpiring(true);
              }
            }
          }
        } catch (err) {
          console.error("Token validation error:", err);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setSessionExpiring(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      <Router>
        <div className="app-container min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
          <div className="creative-background"></div>
          <Navbar user={user} onLogout={handleLogout} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "white",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "white",
                },
              },
            }}
          />

          {/* Session expiring warning */}
          {sessionExpiring && user && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    Your session will expire soon.
                    <button
                      onClick={handleLogout}
                      className="font-medium underline ml-2"
                    >
                      Logout and sign in again
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          <main className="container mx-auto px-4 py-8 relative z-10">
            <Routes>
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Login setUser={setUser} />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  user ? <Dashboard user={user} /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/artwork/new"
                element={
                  user ? <ArtworkForm user={user} /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/artwork/edit/:id"
                element={
                  user ? <ArtworkForm user={user} /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/profile"
                element={
                  user ? <Profile user={user} /> : <Navigate to="/login" />
                }
              />
              <Route
                path="*"
                element={<Navigate to={user ? "/dashboard" : "/login"} />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
