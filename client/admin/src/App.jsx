import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Artworks from "./pages/Artworks";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { UserProvider } from "./context/UserContext";
import api from "./utils/api";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("adminToken");
    if (token) {
      // Verify token is valid by making a request to a protected endpoint
      api
        .get("/admin/dashboard")
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch((error) => {
          localStorage.removeItem("adminToken");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {isAuthenticated ? (
        <UserProvider>
          <Layout setIsAuthenticated={setIsAuthenticated}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/artworks" element={<Artworks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </UserProvider>
      ) : (
        <Routes>
          <Route
            path="*"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
        </Routes>
      )}
    </>
  );
};

export default App;
