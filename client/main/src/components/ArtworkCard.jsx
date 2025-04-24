import React, { useState, useEffect, useRef } from "react";
import { IoPricetagOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { FaEye, FaArrowsAlt } from "react-icons/fa";

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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden art-card border border-gray-100 h-48 sm:h-56 md:h-64">
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400 text-sm sm:text-base">
            Artwork not available
          </p>
        </div>
      </div>
    );
  }

  const isLoading = loadingImages[artwork._id] && !imageLoaded;

  return (
    <motion.div
      key={artwork._id}
      className={`bg-white rounded-lg shadow-lg overflow-hidden art-card border border-gray-100 transition-all duration-300 relative`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="relative overflow-hidden h-48 sm:h-56 md:h-64 cursor-pointer"
        onClick={() => !isLoading && handleImageClick(artwork)}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse">
            <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-gray-800/50 to-transparent">
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <div className="h-4 sm:h-5 bg-white/30 rounded-md w-3/4 mb-1 sm:mb-2"></div>
                <div className="h-3 sm:h-4 bg-white/20 rounded-md w-2/4"></div>
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
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={onImageLoad}
          onError={onImageError}
          loading="lazy"
        />

        {/* Always visible overlay with gradient for better text legibility on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 md:opacity-70 md:hover:opacity-90 transition-opacity duration-300"></div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <h3 className="capitalize text-white font-bold text-base sm:text-lg md:text-xl mb-0.5 sm:mb-1 shadow-text">
                {artwork.title}
              </h3>
              {artwork.artist && (
                <h4 className="capitalize text-white/90 text-xs sm:text-sm shadow-text">
                  By {artwork.artist?.name}
                </h4>
              )}
            </div>
            <p className="text-white/80 text-xs sm:text-sm shadow-text">
              {new Date(artwork.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Category and price tags */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex flex-wrap gap-1 sm:gap-2 max-w-[calc(100%-5rem)]">
          {!isLoading && artwork.category && (
            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow-sm backdrop-blur-sm bg-opacity-90 truncate">
              {artwork.category}
            </span>
          )}
          {!isLoading && artwork.isForSale && artwork.price && (
            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm backdrop-blur-sm bg-opacity-90 truncate">
              <IoPricetagOutline className="mr-0.5 sm:mr-1" />
              {artwork.price} EGP
            </span>
          )}
        </div>

        {/* View indicator for mobile */}
        <div className="absolute top-3 right-3 bg-black/70 rounded-full p-1.5 sm:p-2 shadow-lg text-white sm:hidden">
          <FaEye className="text-xs" />
        </div>
      </div>
    </motion.div>
  );
};

// Add a style for text shadow to improve readability
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(
      ".shadow-text { text-shadow: 0px 1px 2px rgba(0,0,0,0.8); }",
      styleSheet.cssRules.length
    );
  } catch (e) {
    console.error("Failed to add text shadow style rule", e);
  }
}

export default ArtworkCard;
