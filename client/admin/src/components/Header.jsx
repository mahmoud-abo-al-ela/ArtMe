import React from "react";
import { FiLogOut, FiUser } from "react-icons/fi";

const Header = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return (
    <header className="flex justify-end px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
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
