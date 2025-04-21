import React from "react";
import { FiFilter, FiX } from "react-icons/fi";

const UserFilter = ({
  filters,
  setFilters,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
        className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        title="Filter users"
        aria-label="Open filter menu"
        aria-expanded={isFilterMenuOpen}
        aria-controls="filter-menu"
      >
        <FiFilter className="mr-1" size={16} />
        <span className="hidden sm:inline">Filter</span>
      </button>

      {isFilterMenuOpen && (
        <div
          id="filter-menu"
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
          role="menu"
        >
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm text-gray-700">Filters</h3>
              <button
                onClick={() => setIsFilterMenuOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close filter menu"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="mb-2">
              <label
                className="block text-xs text-gray-500 mb-1"
                htmlFor="role-filter"
              >
                Role
              </label>
              <select
                id="role-filter"
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => setFilters({ role: "all" })}
                className="text-xs text-gray-600 hover:text-primary"
                aria-label="Reset filters"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterMenuOpen(false)}
                className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-dark"
                aria-label="Apply filters"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilter;
