import React, { useState, useEffect, useRef } from "react";
import { IoPricetagOutline } from "react-icons/io5";

const ArtworkCard = ({
  artwork,
  loadingImages = {},
  handleImageClick = () => {},
  handleImageLoad = () => {},
  handleImageError = () => {},
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  // Initialize local loading state if loadingImages[artwork._id] is undefined
  useEffect(() => {
    if (artwork?._id && loadingImages[artwork._id] === undefined) {
      handleImageLoad(artwork._id);
    }
  }, [artwork?._id]);

  const onImageLoad = () => {
    setImageLoaded(true);
    if (artwork?._id) {
      handleImageLoad(artwork._id);
    }
  };

  const onImageError = () => {
    setImageLoaded(true); // Still mark as "loaded" to remove skeleton
    if (artwork?._id) {
      handleImageError(artwork._id);
    }
  };

  // If artwork is undefined or null, return a placeholder
  if (!artwork) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden art-card border border-gray-100 h-64">
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">Artwork not available</p>
        </div>
      </div>
    );
  }

  const isLoading = loadingImages[artwork._id] && !imageLoaded;

  return (
    <div
      key={artwork._id}
      className="bg-white rounded-lg shadow-lg overflow-hidden art-card border border-gray-100 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 group relative"
    >
      <div
        className="relative overflow-hidden h-64 cursor-pointer"
        onClick={() => !isLoading && handleImageClick(artwork)}
      >
        {isLoading && (
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
          ref={imgRef}
          src={
            artwork.images && artwork.images.length > 0
              ? artwork.images[0]
              : artwork.imageUrl ||
                "https://via.placeholder.com/300?text=No+Image"
          }
          alt={artwork.title || "Untitled Artwork"}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={onImageLoad}
          onError={onImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end p-4">
          <div className="flex flex-col">
            <h3 className="capitalize text-white font-bold text-xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {artwork.title || "Untitled"}
            </h3>
            {artwork.artist && (
              <h4 className="capitalize text-white/80 mb-1 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                By {artwork.artist?.name || "Unknown Artist"}
              </h4>
            )}
          </div>
          <p className="text-white/80 mb-1 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {artwork.createdAt
              ? new Date(artwork.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Unknown date"}
          </p>
        </div>
        <div className="absolute top-3 left-3 z-10 flex space-x-2">
          {!isLoading && artwork.category && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow-sm backdrop-blur-sm bg-opacity-90">
              {artwork.category}
            </span>
          )}
          {!isLoading && artwork.isForSale && artwork.price && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm backdrop-blur-sm bg-opacity-90">
              <IoPricetagOutline className="mr-1" />
              {artwork.price} EGP
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
