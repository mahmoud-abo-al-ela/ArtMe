import React from "react";

const FilterBar = ({
  filter,
  setFilter,
  artworks,
  categories,
  categoryCountMap,
}) => {
  return (
    <div className="w-full sm:w-auto mb-4 sm:mb-0">
      <h3 className="text-sm font-medium text-gray-500 mb-2">
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        <div
          onClick={() => setFilter("all")}
          className={`cursor-pointer px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all duration-200 font-medium flex items-center ${
            filter === "all"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <span>All Works</span>
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
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
            onClick={() => setFilter(category)}
            className={`cursor-pointer px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all duration-200 font-medium flex items-center ${
              filter === category
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
            }`}
          >
            <span>{category}</span>
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
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
  );
};

export default FilterBar;
