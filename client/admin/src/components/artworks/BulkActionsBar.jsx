import React from "react";
import { FiTrash2 } from "react-icons/fi";

const BulkActionsBar = ({
  selectMode,
  selectedArtworks,
  filteredArtworks,
  selectAll,
  setShowBulkDeleteModal,
  toggleSelectMode,
}) => {
  if (!selectMode) return null;

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 animate-slideIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="select-all"
            className="cursor-pointer h-4 w-4 sm:h-5 sm:w-5 text-primary focus:ring-primary border-gray-300 rounded"
            checked={
              selectedArtworks.length > 0 &&
              selectedArtworks.length === filteredArtworks.length
            }
            onChange={selectAll}
          />
          <label
            htmlFor="select-all"
            className="ml-2 text-sm sm:text-base text-gray-700"
          >
            {selectedArtworks.length === 0
              ? "Select All"
              : `Selected ${selectedArtworks.length} of ${filteredArtworks.length}`}
          </label>
        </div>

        <div className="flex space-x-2">
          {selectedArtworks.length > 0 && (
            <button
              onClick={() => setShowBulkDeleteModal(true)}
              className="cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center text-xs sm:text-sm"
            >
              <FiTrash2 className="mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Delete Selected</span>
              <span className="xs:hidden">Delete</span>
              <span className="ml-1">({selectedArtworks.length})</span>
            </button>
          )}

          <button
            onClick={toggleSelectMode}
            className="cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-xs sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;
