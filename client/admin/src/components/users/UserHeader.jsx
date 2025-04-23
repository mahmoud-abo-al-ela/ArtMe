import React from "react";
import { FiDownload, FiPlus } from "react-icons/fi";
import UserFilter from "./UserFilter";

const UserHeader = ({
  exportUsers,
  handleAddUser,
  filters,
  setFilters,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
}) => {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-4 md:mb-6 w-full">
      <h2 className="text-xl md:text-2xl font-semibold text-text">
        Users Management
      </h2>

      <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
        <div className="hidden md:block">
          <UserFilter
            filters={filters}
            setFilters={setFilters}
            isFilterMenuOpen={isFilterMenuOpen}
            setIsFilterMenuOpen={setIsFilterMenuOpen}
            className="w-full sm:w-auto"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={exportUsers}
            className="flex-1 sm:flex-none flex justify-center items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            title="Export users"
            aria-label="Export users"
          >
            <FiDownload className="mr-1" size={16} />
            <span className="inline">Export</span>
          </button>

          <button
            onClick={handleAddUser}
            className="flex-1 sm:flex-none cursor-pointer flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
            title="Add new user"
            aria-label="Add new user"
          >
            <FiPlus className="mr-1" size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
