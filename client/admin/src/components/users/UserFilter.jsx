import React from "react";
import { FiFilter, FiX, FiChevronRight } from "react-icons/fi";

const UserFilter = ({
  filters,
  setFilters,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
  className,
  variant = "desktop",
}) => {
  const isMobile = variant === "mobile";

  const handleRoleChange = (role) => {
    setFilters({ ...filters, role });
  };

  const resetFilters = () => {
    setFilters({ role: "all" });
  };

  if (isMobile) {
    return (
      <div className="p-4 bg-white border-b w-full">
        <div className="text-xs font-medium text-gray-600 uppercase mb-3 flex items-center">
          <span className="mr-1">Filter By</span>
          <div className="h-px flex-grow bg-gray-200 ml-2"></div>
        </div>
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="mobile-role-filter"
            >
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["all", "user", "admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`py-2 px-3 text-center text-sm rounded-md transition-all duration-200 ${
                    filters.role === role
                      ? "bg-primary bg-opacity-10 text-primary font-medium border border-primary border-opacity-30"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {role === "all" ? "All Roles" : role}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm text-primary hover:text-primary-dark transition-colors px-3 py-2 rounded-md hover:bg-primary hover:bg-opacity-5"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ""}`}>
      <button
        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
        className="w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        title="Filter users"
        aria-label="Open filter menu"
        aria-expanded={isFilterMenuOpen}
        aria-controls="filter-menu"
      >
        <FiFilter className="mr-2" size={16} />
        <span>Filters</span>
        {filters.role !== "all" && (
          <span className="ml-2 bg-primary text-white text-xs py-0.5 px-1.5 rounded-full">
            1
          </span>
        )}
      </button>

      {isFilterMenuOpen && (
        <div
          id="filter-menu"
          className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-hidden transition-all"
          role="menu"
        >
          <div className="p-0">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-medium text-sm text-gray-700">Filters</h3>
              <button
                onClick={() => setIsFilterMenuOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close filter menu"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="p-3 border-b">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="role-filter"
              >
                Role
              </label>
              <div className="space-y-2">
                {["all", "user", "admin"].map((role) => (
                  <div
                    key={role}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      filters.role === role ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleRoleChange(role)}
                  >
                    <input
                      id={`role-${role}`}
                      type="radio"
                      checked={filters.role === role}
                      onChange={() => handleRoleChange(role)}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <label
                      htmlFor={`role-${role}`}
                      className="ml-2 block text-sm text-gray-700 capitalize cursor-pointer"
                    >
                      {role === "all" ? "All Roles" : role}
                    </label>
                    {filters.role === role && (
                      <FiChevronRight
                        className="ml-auto text-primary"
                        size={16}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 flex justify-end bg-gray-50">
              <button
                onClick={resetFilters}
                className="cursor-pointer text-sm text-primary hover:text-primary-dark font-medium"
                aria-label="Reset filters"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilter;
