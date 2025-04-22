import React from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";

const ArtworkCard = ({
  artwork,
  onView,
  onDelete,
  isSelected,
  onToggleSelect,
  selectMode,
}) => {
  return (
    <div
      className={`relative bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 ${
        isSelected ? "ring-2 ring-gray-300" : ""
      }`}
    >
      {selectMode && (
        <div className="absolute top-2 left-2 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(artwork._id)}
            className="cursor-pointer h-5 w-5 text-gray-300 focus:ring-gray-300 border-gray-300 rounded"
          />
        </div>
      )}
      <div className="h-48 overflow-hidden">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-black text-lg mb-2 capitalize">
          {artwork.title}
        </h3>
        <p className="text-black text-sm mb-1 capitalize">
          By: {artwork.artist.name}
        </p>
        {artwork.price && (
          <p className="text-black font-medium mb-1">
            Price: {artwork.price} EGP
          </p>
        )}
        <div className="flex space-x-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => onView(artwork)}
            className="cursor-pointer flex-1 flex items-center justify-center py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-black text-sm transition-colors"
          >
            <FiEye className="mr-1" />
            <span>View</span>
          </button>
          <button
            onClick={() => onDelete(artwork)}
            className="cursor-pointer flex-1 flex items-center justify-center py-2 px-3 bg-red-50 hover:bg-red-100 rounded text-red-500 text-sm transition-colors"
          >
            <FiTrash2 className="mr-1" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
