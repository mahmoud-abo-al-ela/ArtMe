import React, { useState } from "react";
import { FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";

const FilterBar = ({
  filter,
  setFilter,
  artworks,
  categories,
  categoryCountMap,
}) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Toggle filter on mobile
  const toggleFilterExpand = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  return (
    <div className="w-full mb-4 sm:mb-0">
      {/* Mobile filter button */}
      <div
        className="md:hidden flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm mb-2"
        onClick={toggleFilterExpand}
        aria-expanded={isFilterExpanded}
        aria-controls="filter-options"
      >
        <div className="flex items-center">
          <FaFilter className="text-indigo-600 mr-2" />
          <span className="font-medium text-gray-700">
            Filter by Category:{" "}
            <span className="text-indigo-600">
              {filter === "all" ? "All Works" : filter}
            </span>
          </span>
        </div>
        {isFilterExpanded ? (
          <FaChevronUp className="text-indigo-600" />
        ) : (
          <FaChevronDown className="text-indigo-600" />
        )}
      </div>

      {/* Filter options - hidden on mobile unless expanded */}
      <div
        id="filter-options"
        className={`md:block ${isFilterExpanded ? "block" : "hidden"}`}
      >
        <h3 className="text-sm font-medium text-gray-500 mb-2 hidden md:block">
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          <div
            onClick={() => {
              setFilter("all");
              setIsFilterExpanded(false);
            }}
            className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full whitespace-nowrap transition-all duration-200 font-medium flex items-center ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
            }`}
          >
            <span>All Works</span>
            <span
              className={`ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                filter === "all"
                  ? "bg-white bg-opacity-20 text-black"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {artworks.length}
            </span>
          </div>
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => {
                setFilter(category);
                setIsFilterExpanded(false);
              }}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full whitespace-nowrap transition-all duration-200 font-medium flex items-center ${
                filter === category
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <span>{category}</span>
              <span
                className={`ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                  filter === category
                    ? "bg-white bg-opacity-20 text-black"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {categoryCountMap[category] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
