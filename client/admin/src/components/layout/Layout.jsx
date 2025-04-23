import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { FiMenu } from "react-icons/fi";

const Layout = ({ children, setIsAuthenticated }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-full">
        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-10"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar component - conditionally shown based on screen size and state */}
        <div
          className={`${
            isMobile
              ? `fixed inset-y-0 left-0 z-20 w-64 transition-transform duration-300 transform ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "relative"
          }`}
        >
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header
            setIsAuthenticated={setIsAuthenticated}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
          />
          <main className="p-3 md:p-6 overflow-auto flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
