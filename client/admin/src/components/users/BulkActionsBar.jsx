import React from "react";

const BulkActionsBar = ({ selectedUsers, handleBulkDelete }) => {
  if (selectedUsers.length === 0) return null;

  return (
    <div
      className="flex items-center mb-4 p-2 bg-gray-50 rounded"
      role="region"
      aria-live="polite"
    >
      <span className="text-sm text-gray-600 mr-2">
        {selectedUsers.length} user
        {selectedUsers.length !== 1 ? "s" : ""} selected
      </span>
      <button
        onClick={handleBulkDelete}
        className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition-colors"
        aria-label={`Delete ${selectedUsers.length} selected users`}
      >
        Delete Selected
      </button>
    </div>
  );
};

export default BulkActionsBar;
