import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaTimes, FaShare, FaDownload } from "react-icons/fa";
import {
  MdCategory,
  MdDescription,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { IoPricetagOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const FullImageView = ({
  fullImage,
  closeFullImage,
  loadingImages,
  handleImageLoad,
  handleImageError,
  setShowDeleteConfirm,
  navigateNext,
  navigatePrevious,
  onEdit,
}) => {
  const modalRef = useRef(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeout;
    const handleMovement = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMovement);
    window.addEventListener("touchmove", handleMovement);

    return () => {
      window.removeEventListener("mousemove", handleMovement);
      window.removeEventListener("touchmove", handleMovement);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
  }, [fullImage?._id]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeFullImage();
      else if (e.key === "ArrowRight" && navigateNext) navigateNext();
      else if (e.key === "ArrowLeft" && navigatePrevious) navigatePrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeFullImage, navigateNext, navigatePrevious]);

  if (!fullImage) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fullImage.imageUrl;
    link.download = `${fullImage.title || "artwork"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: fullImage.title,
        text:
          fullImage.description || `Check out this artwork: ${fullImage.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"));
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black/70 backdrop-blur-md"
        onClick={closeFullImage}
        role="dialog"
        aria-labelledby="artwork-title"
        aria-modal="true"
        tabIndex="-1"
        ref={modalRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative w-full max-w-7xl max-h-[60vh] flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", bounce: 0.3 }}
        >
          {navigatePrevious && (
            <motion.button
              className={`absolute left-6 top-1/2 -translate-y-1/2 z-20 text-white bg-black/50 hover:bg-black/70 p-3 rounded-full transition-all duration-200 ${
                showControls ? "opacity-90" : "opacity-0"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                navigatePrevious();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous image"
            >
              <MdKeyboardArrowLeft size={28} />
            </motion.button>
          )}

          {navigateNext && (
            <motion.button
              className={`absolute right-6 top-1/2 -translate-y-1/2 z-20 text-white bg-black/50 hover:bg-black/70 p-3 rounded-full transition-all duration-200 ${
                showControls ? "opacity-90" : "opacity-0"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                navigateNext();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next image"
            >
              <MdKeyboardArrowRight size={28} />
            </motion.button>
          )}

          <motion.button
            className={`absolute top-4 right-4 z-30 w-12 h-12 rounded-full bg-white/95 dark:bg-gray-800/95 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-md ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeFullImage}
            aria-label="Close full image view"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTimes size={24} className="text-gray-800 dark:text-gray-200" />
          </motion.button>

          <div className="relative flex-1 bg-black flex items-center justify-center h-[60vh] w-[60vw]">
            {isLoading && !imageError && (
              <div className="flex items-center justify-center h-full w-full bg-gray-950 text-gray-400">
                <p className="text-lg">Loading...</p>
              </div>
            )}
            {imageError ? (
              <div className="flex items-center justify-center h-full w-full bg-gray-950 text-gray-400">
                <p className="text-lg">Failed to load image</p>
              </div>
            ) : (
              <img
                src={fullImage.imageUrl}
                alt={`Artwork titled ${fullImage.title}`}
                className="max-w-full max-h-full object-contain select-none"
                onLoad={(e) => {
                  setIsLoading(false);
                  handleImageLoad(fullImage._id);
                }}
                onError={() => {
                  setIsLoading(false);
                  handleImageError(fullImage._id);
                  setImageError(true);
                }}
                draggable="false"
              />
            )}
          </div>

          <motion.div
            className="w-full md:w-96 bg-white dark:bg-gray-900 p-8 flex flex-col justify-between overflow-y-auto border-l border-gray-200 dark:border-gray-700"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <Link
                  to={`/artwork/${fullImage._id}`}
                  className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-serif capitalize hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {fullImage.title}
                </Link>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <MdCategory
                    className="text-indigo-600 dark:text-indigo-400 flex-shrink-0"
                    size={20}
                  />
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors">
                    {fullImage.category}
                  </span>
                </div>

                {fullImage.description && (
                  <div className="flex flex-col">
                    <div className="flex items-start">
                      <MdDescription
                        className="text-indigo-600 dark:text-indigo-400 mr-2 mt-1 flex-shrink-0"
                        size={20}
                      />
                      <p
                        className={`text-base text-gray-600 dark:text-gray-300 transition-all duration-300 ${
                          !isDescriptionExpanded &&
                          fullImage.description.length > 100
                            ? "line-clamp-3"
                            : ""
                        }`}
                        id="artwork-description"
                      >
                        {fullImage.description}
                      </p>
                    </div>
                    {fullImage.description.length > 100 && (
                      <button
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mt-2 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-6"
                        aria-controls="artwork-description"
                        aria-expanded={isDescriptionExpanded}
                      >
                        {isDescriptionExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 space-y-3 border border-gray-100 dark:border-gray-700 shadow-sm">
                  {fullImage.medium && (
                    <div className="flex text-sm">
                      <span className="text-gray-500 dark:text-gray-400 w-24 font-medium">
                        Medium:
                      </span>
                      <span className="text-gray-900 dark:text-gray-200">
                        {fullImage.medium}
                      </span>
                    </div>
                  )}
                  {fullImage.dimensions && (
                    <div className="flex text-sm">
                      <span className="text-gray-500 dark:text-gray-400 w-24 font-medium">
                        Dimensions:
                      </span>
                      <span className="text-gray-900 dark:text-gray-200">
                        {fullImage.dimensions}
                      </span>
                    </div>
                  )}
                  {fullImage.year && (
                    <div className="flex text-sm">
                      <span className="text-gray-500 dark:text-gray-400 w-24 font-medium">
                        Year:
                      </span>
                      <span className="text-gray-900 dark:text-gray-200">
                        {fullImage.year}
                      </span>
                    </div>
                  )}
                  <div className="flex text-sm">
                    <span className="text-gray-500 dark:text-gray-400 w-24 font-medium">
                      Created:
                    </span>
                    <span className="text-gray-900 dark:text-gray-200">
                      {new Date(fullImage.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                {fullImage.isForSale && fullImage.price && (
                  <div className="flex items-center">
                    <IoPricetagOutline
                      className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-base font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-4 py-1.5 rounded-full shadow-sm">
                      {fullImage.price} EGP
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <motion.button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Share artwork"
              >
                <FaShare size={16} />
                Share
              </motion.button>
              <motion.button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Download artwork"
              >
                <FaDownload size={16} />
                Download
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.getElementById("modal-root")
  );
};

export default FullImageView;
