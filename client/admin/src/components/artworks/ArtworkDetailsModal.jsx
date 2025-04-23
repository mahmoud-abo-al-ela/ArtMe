import React from "react";
import { FiX } from "react-icons/fi";

const ArtworkDetailsModal = ({ artwork, onClose }) => {
  if (!artwork) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 flex justify-between items-center p-3 sm:p-4 border-b bg-white z-10">
          <h3 className="text-lg sm:text-xl font-semibold capitalize truncate pr-2">
            {artwork.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="w-full">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h4 className="text-xs sm:text-sm text-gray-500 mb-1">Artist</h4>
              <p className="font-medium text-sm sm:text-base">
                {artwork.artist.name}
              </p>
            </div>

            {artwork.description && (
              <div>
                <h4 className="text-xs sm:text-sm text-gray-500 mb-1">
                  Description
                </h4>
                <p className="text-sm sm:text-base">{artwork.description}</p>
              </div>
            )}

            <div>
              <h4 className="text-xs sm:text-sm text-gray-500 mb-1">
                Category
              </h4>
              <p className="font-medium text-sm sm:text-base">
                {artwork.category}
              </p>
            </div>

            {artwork.price && (
              <div>
                <h4 className="text-xs sm:text-sm text-gray-500 mb-1">Price</h4>
                <p className="font-medium text-sm sm:text-base">
                  {artwork.price} EGP
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs sm:text-sm text-gray-500 mb-1">
                Created At
              </h4>
              <p className="font-medium text-sm sm:text-base">
                {new Date(artwork.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailsModal;
