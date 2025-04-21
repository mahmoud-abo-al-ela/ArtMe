import React from "react";
import { FiRefreshCw, FiDownload, FiPlus } from "react-icons/fi";
import UserFilter from "./UserFilter";

const UserHeader = ({
  fetchUsers,
  loading,
  refreshing,
  exportUsers,
  handleAddUser,
  filters,
  setFilters,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-text">Users Management</h2>

      <div className="flex space-x-2">
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          title="Refresh users"
          aria-label="Refresh users"
        >
          <FiRefreshCw
            className={`${refreshing ? "animate-spin" : ""} mr-1`}
            size={16}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <UserFilter
          filters={filters}
          setFilters={setFilters}
          isFilterMenuOpen={isFilterMenuOpen}
          setIsFilterMenuOpen={setIsFilterMenuOpen}
        />

        <button
          onClick={exportUsers}
          className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          title="Export users"
          aria-label="Export users"
        >
          <FiDownload className="mr-1" size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={handleAddUser}
          className="cursor-pointer flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
          title="Add new user"
          aria-label="Add new user"
        >
          <FiPlus className="mr-1" size={16} />
          <span>Add User</span>
        </button>
      </div>
    </div>
  );
};

export default UserHeader;
