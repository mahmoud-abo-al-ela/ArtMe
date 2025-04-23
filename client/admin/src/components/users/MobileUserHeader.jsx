import React from "react";
import {
  FiFilter,
  FiChevronUp,
  FiChevronDown,
  FiUsers,
  FiCheck,
} from "react-icons/fi";

const MobileUserHeader = ({
  userCount,
  nonAdminCount = userCount - 1, // Default to userCount - 1 if not provided
  allSelected,
  onSelectAll,
  showMobileFilters,
  setShowMobileFilters,
}) => {
  return (
    <div className="md:hidden sticky top-0 z-10 p-4 bg-white border-b shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        <div onClick={onSelectAll} className="mr-3 cursor-pointer">
          <div
            className={`w-5 h-5 flex items-center justify-center rounded-full border transition-colors ${
              allSelected
                ? "bg-blue-500 border-gray-300 text-white"
                : "border-gray-300 bg-white"
            }`}
            role="checkbox"
            aria-checked={allSelected}
            aria-label="Select all non-admin users"
            tabIndex={0}
          >
            {allSelected && <FiCheck size={12} />}
          </div>
        </div>

        <div className="flex items-center">
          <FiUsers className="mr-2 text-primary" size={16} />
          <span className="text-sm font-medium">
            <span className="text-primary">{nonAdminCount} Users</span>{" "}
          </span>
        </div>
      </div>

      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className={`flex items-center text-sm rounded-md px-3 py-1.5 transition-colors ${
          showMobileFilters
            ? "bg-primary bg-opacity-10 text-primary border border-primary border-opacity-30"
            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
        }`}
        aria-expanded={showMobileFilters}
        aria-controls="mobile-filters"
      >
        <FiFilter className="mr-1.5" size={14} />
        <span>Filter & Sort</span>
        {showMobileFilters ? (
          <FiChevronUp className="ml-1" size={14} />
        ) : (
          <FiChevronDown className="ml-1" size={14} />
        )}
      </button>
    </div>
  );
};

export default MobileUserHeader;
