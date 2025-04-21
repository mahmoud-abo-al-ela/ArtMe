import React from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoPricetagOutline } from "react-icons/io5";

const ArtworkCard = ({
  artwork,
  loadingImages,
  handleImageClick,
  setShowDeleteConfirm,
  handleImageLoad,
  handleImageError,
}) => {
  return (
    <div
      key={artwork._id}
      className="bg-white rounded-lg shadow-lg overflow-hidden art-card border border-gray-100 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 group relative"
    >
      <div
        className="relative overflow-hidden h-64 cursor-pointer"
        onClick={() => !loadingImages[artwork._id] && handleImageClick(artwork)}
      >
        {loadingImages[artwork._id] && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse">
            <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-800/50 to-transparent">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-5 bg-white/30 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-white/20 rounded-md w-2/4"></div>
              </div>
            </div>
          </div>
        )}
        <img
          src={
            artwork.images && artwork.images.length > 0
              ? artwork.images[0]
              : artwork.imageUrl
          }
          alt={artwork.title}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            loadingImages[artwork._id] ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => handleImageLoad(artwork._id)}
          onError={() => handleImageError(artwork._id)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {artwork.title}
          </h3>
          <p className="text-white/80 mb-1 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            Created on{" "}
            {new Date(artwork.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="absolute top-3 left-3 z-10 flex space-x-2">
          {!loadingImages[artwork._id] && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow-sm backdrop-blur-sm bg-opacity-90">
              {artwork.category}
            </span>
          )}
          {!loadingImages[artwork._id] &&
            artwork.isForSale &&
            artwork.price && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm backdrop-blur-sm bg-opacity-90">
                <IoPricetagOutline className="mr-1" />
                {artwork.price} EGP
              </span>
            )}
        </div>
        <div className="absolute top-3 right-3 z-10 flex space-x-2">
          {!loadingImages[artwork._id] && (
            <>
              <Link
                to={`/artwork/edit/${artwork._id}`}
                className="text-indigo-500 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                title="Edit Artwork"
              >
                <FaEdit />
              </Link>
              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(artwork._id);
                }}
                title="Delete Artwork"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
