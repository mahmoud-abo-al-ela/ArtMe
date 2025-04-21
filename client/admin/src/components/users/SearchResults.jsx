import React from "react";

const SearchResults = ({ searchQuery, filteredUsers }) => {
  if (!searchQuery) return null;

  return (
    <div className="mb-4 text-sm text-gray-500" aria-live="polite">
      Found {filteredUsers.length} user
      {filteredUsers.length !== 1 ? "s" : ""} matching "{searchQuery}"
    </div>
  );
};

export default SearchResults;
