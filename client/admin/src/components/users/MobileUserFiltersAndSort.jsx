import React, { useEffect, useRef } from "react";
import { SortUtils } from "./UserTableHeader";
import UserFilter from "./UserFilter";
import { FiCheck } from "react-icons/fi";

const MobileUserFiltersAndSort = ({
  onSort,
  sortField,
  sortDirection,
  filters,
  setFilters,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
}) => {
  const { renderSortIcon, handleColumnClick } = SortUtils;
  const filterRef = useRef(null);

  // Add swipe gesture for closing filter panel
  useEffect(() => {
    const filterEl = filterRef.current;
    if (!filterEl) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 100) {
        // Swipe left to close filters
        setIsFilterMenuOpen(false);
      }
    };

    filterEl.addEventListener("touchstart", handleTouchStart);
    filterEl.addEventListener("touchend", handleTouchEnd);

    return () => {
      filterEl.removeEventListener("touchstart", handleTouchStart);
      filterEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setIsFilterMenuOpen]);

  return (
    <div
      className="md:hidden sticky top-0 z-10 bg-white shadow-md"
      id="mobile-filters"
      ref={filterRef}
    >
      {/* Sorting Section */}
      <div className="p-4 bg-white border-b">
        <div className="text-xs font-medium text-gray-600 uppercase mb-3 flex items-center">
          <span className="mr-1">Sort By</span>
          <div className="h-px flex-grow bg-gray-200 ml-2"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "name", label: "Name" },
            { id: "email", label: "Email" },
            { id: "role", label: "Role" },
            { id: "createdAt", label: "Created" },
          ].map((column) => (
            <button
              key={column.id}
              onClick={() => handleColumnClick(column.id, onSort)}
              className={`relative text-left p-3 rounded-md text-sm flex items-center justify-between transition-all duration-200 ${
                sortField === column.id
                  ? "bg-primary bg-opacity-10 text-primary font-medium border border-primary border-opacity-30"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              <span>{column.label}</span>
              {sortField === column.id ? (
                <div className="flex items-center">
                  <FiCheck className="mr-1" size={14} />
                  {renderSortIcon(column.id, sortField, sortDirection)}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Filtering Section */}
      <UserFilter
        filters={filters}
        setFilters={setFilters}
        isFilterMenuOpen={isFilterMenuOpen}
        setIsFilterMenuOpen={setIsFilterMenuOpen}
        variant="mobile"
      />
    </div>
  );
};

export default MobileUserFiltersAndSort;
