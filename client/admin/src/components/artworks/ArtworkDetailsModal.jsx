import React from "react";
import { FiX } from "react-icons/fi";

const ArtworkDetailsModal = ({ artwork, onClose }) => {
  if (!artwork) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold capitalize">{artwork.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
          <div>
            <div className="mb-4">
              <h4 className="text-sm text-gray-500">Artist</h4>
              <p className="font-medium">{artwork.artist.name}</p>
            </div>

            {artwork.description && (
              <div className="mb-4">
                <h4 className="text-sm text-gray-500">Description</h4>
                <p>{artwork.description}</p>
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-sm text-gray-500">Category</h4>
              <p className="font-medium">{artwork.category}</p>
            </div>

            {artwork.price && (
              <div className="mb-4">
                <h4 className="text-sm text-gray-500">Price</h4>
                <p className="font-medium">Price: {artwork.price} EGP</p>
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-sm text-gray-500">Created At</h4>
              <p className="font-medium">
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
