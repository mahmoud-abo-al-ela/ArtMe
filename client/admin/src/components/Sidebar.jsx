import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiImage, FiSettings } from "react-icons/fi";

const Sidebar = ({ closeSidebar }) => {
  const handleNavLinkClick = () => {
    // Only close sidebar if closeSidebar function exists (mobile view)
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 mb-6">
        <h2 className="text-2xl font-semibold">ArtMe</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1 px-3">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-gray-800" : "hover:bg-gray-800/50"
                }`
              }
              end
              onClick={handleNavLinkClick}
            >
              <FiHome className="mr-3 text-xl" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-gray-800" : "hover:bg-gray-800/50"
                }`
              }
              onClick={handleNavLinkClick}
            >
              <FiUsers className="mr-3 text-xl" />
              <span>Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/artworks"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-gray-800" : "hover:bg-gray-800/50"
                }`
              }
              onClick={handleNavLinkClick}
            >
              <FiImage className="mr-3 text-xl" />
              <span>Artworks</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
