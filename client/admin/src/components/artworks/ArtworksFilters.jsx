import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

const ArtworksFilters = ({
  searchInputRef,
  filterOpen,
  setFilterOpen,
  filterOptions,
  handleFilterChange,
  handleSearchChange,
  resetFilters,
  categories,
}) => {
  // Add local state to hold temporary filter values
  const [tempFilters, setTempFilters] = useState({
    category: filterOptions.category,
    sortBy: filterOptions.sortBy,
  });

  // Update temp filters when actual filters change
  useEffect(() => {
    setTempFilters({
      category: filterOptions.category,
      sortBy: filterOptions.sortBy,
    });
  }, [filterOptions]);

  // Apply filter immediately when selection changes
  const handleTempFilterChange = (filterKey, value) => {
    // Update temp filters
    setTempFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));

    // Apply the filter immediately
    handleFilterChange(filterKey, value);
  };

  // Reset temp filters and actual filters
  const handleResetFilters = () => {
    resetFilters();
    setTempFilters({
      category: "all",
      sortBy: "newest",
    });
  };

  return (
    <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center sm:space-x-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            id="search-input"
            ref={searchInputRef}
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary text-sm"
            placeholder="Search by title, artist, or description..."
            onChange={handleSearchChange}
            aria-label="Search artworks"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full sm:w-auto flex items-center justify-center px-3 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            title="Filter artworks"
            aria-label="Open filter menu"
            aria-expanded={filterOpen}
            aria-controls="filter-menu"
          >
            <FiFilter className="mr-1" size={16} />
            <span>Filter</span>
          </button>

          {filterOpen && (
            <div
              id="filter-menu"
              className="absolute right-0 sm:right-0 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              role="menu"
            >
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm text-gray-700">Filters</h3>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Close filter menu"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                <div className="mb-2">
                  <label
                    className="block text-xs text-gray-500 mb-1"
                    htmlFor="category-filter"
                  >
                    Category
                  </label>
                  <select
                    id="category-filter"
                    value={tempFilters.category}
                    onChange={(e) =>
                      handleTempFilterChange("category", e.target.value)
                    }
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label
                    className="block text-xs text-gray-500 mb-1"
                    htmlFor="sort-filter"
                  >
                    Sort By
                  </label>
                  <select
                    id="sort-filter"
                    value={tempFilters.sortBy}
                    onChange={(e) =>
                      handleTempFilterChange("sortBy", e.target.value)
                    }
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="artist">Artist Name (A-Z)</option>
                  </select>
                </div>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={handleResetFilters}
                    className="cursor-pointer text-xs text-gray-600 hover:text-gray-800 bg-gray-100 rounded-md px-2 py-1"
                    aria-label="Reset filters"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworksFilters;
