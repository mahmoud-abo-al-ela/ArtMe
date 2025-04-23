import React from "react";
import { FiLogOut, FiUser, FiMenu } from "react-icons/fi";

const Header = ({
  setIsAuthenticated,
  toggleSidebar,
  isMobile,
  sidebarOpen,
}) => {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
      {/* Hamburger menu button - only visible on mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
          aria-controls="mobile-sidebar"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      )}

      <div className="flex items-center ml-auto">
        <div className="flex items-center mr-6">
          <FiUser className="mr-2" />
          <span className="text-gray-700">Admin</span>
        </div>
        <button
          className="flex items-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          onClick={handleLogout}
        >
          <FiLogOut className="mr-1" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
