import React from "react";
import { FiTrash2 } from "react-icons/fi";

const BulkActionsBar = ({ selectedUsers, handleBulkDelete }) => {
  if (selectedUsers.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center justify-between mb-4 p-2 bg-gray-50 rounded"
      role="region"
      aria-live="polite"
    >
      <span className="text-xs sm:text-sm text-gray-600 mr-2">
        {selectedUsers.length} user
        {selectedUsers.length !== 1 ? "s" : ""} selected
      </span>
      <button
        onClick={handleBulkDelete}
        className="cursor-pointer text-xs sm:text-sm bg-red-50 text-red-600 px-2 sm:px-3 py-1 rounded hover:bg-red-100 transition-colors flex items-center"
        aria-label={`Delete ${selectedUsers.length} selected users`}
      >
        <FiTrash2 className="mr-1" size={14} />
        Delete Selected
      </button>
    </div>
  );
};

export default BulkActionsBar;
