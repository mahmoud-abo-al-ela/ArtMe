import React from "react";
import { FaTrash, FaSpinner } from "react-icons/fa";

const DeleteConfirmation = ({
  artwork,
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDelete,
  deletingArtwork,
}) => {
  if (showDeleteConfirm !== artwork._id) return null;

  return (
    <div
      className="absolute inset-0 bg-[#2f292971] bg-opacity-70 flex items-center justify-center z-20 rounded-lg"
      onClick={(e) => {
        e.stopPropagation();
        setShowDeleteConfirm(null);
      }}
    >
      <div
        className="bg-white rounded-lg max-w-[90%] w-full py-4 px-5 shadow-lg animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-3">
          <div className="bg-red-100 p-1.5 rounded-full mr-2">
            <FaTrash className="text-red-500 text-sm" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Delete Artwork?
          </h3>
        </div>
        <p className="text-gray-700 text-sm mb-4">
          Are you sure you want to delete "{artwork.title}"?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(null);
            }}
            className="px-3 py-1.5 text-sm bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(artwork._id);
            }}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
            disabled={deletingArtwork === artwork._id}
          >
            {deletingArtwork === artwork._id ? (
              <>
                <FaSpinner className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="mr-1.5 text-xs" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
