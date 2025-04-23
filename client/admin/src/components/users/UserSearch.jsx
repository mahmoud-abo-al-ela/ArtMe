import React from "react";
import { FiX, FiSearch } from "react-icons/fi";

const UserSearch = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleClearSearch,
}) => {
  return (
    <form className="flex mb-4" onSubmit={handleSearch} role="search">
      <div className="relative flex-grow">
        <label htmlFor="user-search-input" className="sr-only">
          Search users
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="user-search-input"
            type="text"
            placeholder="Search by name, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 text-sm sm:text-base"
            aria-label="Search users"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>
      <button type="submit" className="sr-only" aria-label="Submit search">
        Search
      </button>
    </form>
  );
};

export default UserSearch;
