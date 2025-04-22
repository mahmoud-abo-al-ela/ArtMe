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
    <div className="bg-white p-4 rounded-lg shadow mb-4 animate-slideIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="select-all"
            className="cursor-pointer h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            checked={
              selectedArtworks.length > 0 &&
              selectedArtworks.length === filteredArtworks.length
            }
            onChange={selectAll}
          />
          <label htmlFor="select-all" className="ml-2 text-gray-700">
            {selectedArtworks.length === 0
              ? "Select All"
              : `Selected ${selectedArtworks.length} of ${filteredArtworks.length}`}
          </label>
        </div>

        <div className="flex space-x-2">
          {selectedArtworks.length > 0 && (
            <button
              onClick={() => setShowBulkDeleteModal(true)}
              className="cursor-pointer px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center"
            >
              <FiTrash2 className="mr-2" />
              Delete Selected ({selectedArtworks.length})
            </button>
          )}

          <button
            onClick={toggleSelectMode}
            className="cursor-pointer px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;
