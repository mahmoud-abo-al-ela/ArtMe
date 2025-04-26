import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FaTimes,
  FaShare,
  FaDownload,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import {
  MdCalendarToday,
  MdCategory,
  MdDescription,
  MdPerson,
  MdCheckCircle,
} from "react-icons/md";
import { IoPricetagOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const FullImageView = ({
  fullImage,
  closeFullImage,
  handleImageLoad,
  handleImageError,
}) => {
  const modalRef = useRef(null);
  const shareMenuRef = useRef(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [scale, setScale] = useState(1);

  // Handle control visibility on movement
  useEffect(() => {
    let timeout;
    const handleMovement = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("mousemove", handleMovement);
    window.addEventListener("touchmove", handleMovement);

    return () => {
      window.removeEventListener("mousemove", handleMovement);
      window.removeEventListener("touchmove", handleMovement);
      clearTimeout(timeout);
    };
  }, []);

  // Reset state on image change
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
    setScale(1);
  }, [fullImage?._id]);

  // Handle modal focus and escape key
  useEffect(() => {
    if (modalRef.current) modalRef.current.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showShareOptions) setShowShareOptions(false);
        else closeFullImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeFullImage, showShareOptions]);

  // Handle click outside share menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShowShareOptions(false);
      }
    };

    if (showShareOptions)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareOptions]);

  // Handle image download
  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadProgress(10);

      const response = await fetch(fullImage.imageUrl);
      if (!response.ok) throw new Error("Failed to download image");

      setDownloadProgress(50);
      const blob = await response.blob();
      setDownloadProgress(80);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fullImage.title || "artwork"}.jpg`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadProgress(100);
      setDownloadSuccess(true);

      setTimeout(() => {
        setIsDownloading(false);
        setTimeout(() => {
          setDownloadSuccess(false);
          setDownloadProgress(0);
        }, 500);
      }, 1500);
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
      setDownloadProgress(0);
      alert("Failed to download. Please try again later.");
    }
  };

  // Handle share link copying
  const handleShareLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(() => alert("Failed to copy link"));
    setShowShareOptions(false);
  };

  // Handle share functionality
  const handleShare = () => {
    if (showShareOptions) {
      setShowShareOptions(false);
      return;
    }

    if (navigator.share) {
      navigator
        .share({
          title: fullImage.title,
          text:
            fullImage.description ||
            `Check out this artwork: ${fullImage.title}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Share failed:", err);
          setShowShareOptions(true);
        });
    } else {
      setShowShareOptions(true);
    }
  };

  // Handle social media sharing
  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(fullImage.title);
    const text = encodeURIComponent(
      fullImage.description || `Check out this artwork: ${fullImage.title}`
    );

    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareOptions(false);
  };

  // Handle touch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const initialDistance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
      );
      e.target.dataset.initialDistance = initialDistance;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
      );
      const initialDistance = parseFloat(e.target.dataset.initialDistance);
      const newScale = Math.min(
        Math.max(1, (currentDistance / initialDistance) * 1),
        3
      );
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    if (scale < 1.2) setScale(1);
  };

  if (!fullImage) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
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
          className="relative w-full h-full max-w-[95vw] max-h-[95vh] sm:max-w-4xl md:max-w-6xl lg:max-w-7xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-y-auto flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", bounce: 0.3 }}
        >
          {/* Close Button */}
          <motion.div
            className={`absolute top-3 right-3 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all shadow-md ${
              showControls || showShareOptions ? "opacity-100" : "opacity-50"
            }`}
            onClick={closeFullImage}
            aria-label="Close image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaTimes className="text-gray-800 dark:text-gray-200 text-base sm:text-lg" />
          </motion.div>

          {/* Image Section */}
          <div
            className="relative flex-1 bg-gray-950 flex items-center justify-center h-[50vh] md:h-auto w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isLoading && !imageError && (
              <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 border-t-indigo-500 border-indigo-200/30 rounded-full animate-spin mb-2"></div>
                <p className="text-sm sm:text-base font-medium text-indigo-300">
                  Loading...
                </p>
              </div>
            )}
            {imageError ? (
              <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
                <FaTimes size={24} className="text-red-500 mb-2" />
                <p className="text-sm sm:text-base font-medium">
                  Failed to load image
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isLoading ? 0 : 1,
                  scale: isLoading ? 0.95 : scale,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <img
                  src={fullImage.images?.[0] || fullImage.imageUrl}
                  alt={`Artwork titled ${fullImage.title}`}
                  className="max-w-full h-full object-contain select-none"
                  style={{ filter: "drop-shadow(0 8px 6px rgb(0 0 0 / 0.4))" }}
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
                {fullImage.isForSale && fullImage.price && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <IoPricetagOutline
                        className="text-purple-300"
                        size={16}
                      />
                      <span className="text-sm sm:text-base font-bold text-white">
                        {fullImage.price}{" "}
                        <span className="text-purple-300">EGP</span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Details Section */}
          <motion.div
            className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-900 p-4 sm:p-6 flex flex-col h-[50%] md:h-full"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-gray-800 dark:text-gray-100 capitalize mb-4 sm:mb-6"
                id="artwork-title"
              >
                {fullImage.title}
              </h2>

              <div className="space-y-4 sm:space-y-5">
                {fullImage.artist && (
                  <motion.div
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <MdPerson
                      className="text-indigo-600 dark:text-indigo-400"
                      size={20}
                    />
                    <div>
                      <span className="mr-2 text-xs uppercase text-gray-500 dark:text-gray-400">
                        Artist
                      </span>
                      <h4 className="text-sm sm:text-base inline text-gray-900 dark:text-gray-200">
                        {fullImage.artist.name}
                      </h4>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <MdCategory
                    className="text-green-600 dark:text-green-400"
                    size={20}
                  />
                  <div>
                    <span className="mr-2 text-xs uppercase text-gray-500 dark:text-gray-400">
                      Category
                    </span>
                    <span className="text-sm sm:text-base text-gray-900 dark:text-gray-200">
                      {fullImage.category}
                    </span>
                  </div>
                </motion.div>

                {fullImage.description && (
                  <motion.div
                    className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3">
                      <MdDescription
                        className="text-amber-600 dark:text-amber-400"
                        size={20}
                      />
                      <span className="mr-2 text-xs uppercase text-gray-500 dark:text-gray-400">
                        Description
                      </span>
                    </div>
                    <p
                      className={`text-sm sm:text-base text-gray-900 dark:text-gray-200 ${
                        !isDescriptionExpanded &&
                        fullImage.description.length > 100
                          ? "line-clamp-3"
                          : ""
                      }`}
                      id="artwork-description"
                    >
                      {fullImage.description}
                    </p>
                    {fullImage.description.length > 100 && (
                      <div
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                        className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                        aria-controls="artwork-description"
                        aria-expanded={isDescriptionExpanded}
                      >
                        {isDescriptionExpanded ? "Show less" : "Read more"}
                      </div>
                    )}
                  </motion.div>
                )}

                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <MdCalendarToday
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                  <div>
                    <span className="mr-2 text-xs uppercase text-gray-500 dark:text-gray-400">
                      Created
                    </span>
                    <span className="text-sm sm:text-base text-gray-900 dark:text-gray-200">
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
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <motion.div className="relative flex-1">
                <motion.div
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Share artwork"
                >
                  <FaShare size={16} />
                  <span className="text-sm sm:text-base">Share</span>
                </motion.div>
                <AnimatePresence>
                  {showShareOptions && (
                    <motion.div
                      ref={shareMenuRef}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 w-full max-h-60 overflow-y-auto"
                    >
                      <div className="flex flex-col gap-2">
                        <div
                          onClick={() => handleSocialShare("facebook")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <FaFacebook size={18} className="text-blue-600" />
                          <span className="text-sm">Facebook</span>
                        </div>
                        <div
                          onClick={() => handleSocialShare("twitter")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <FaTwitter size={18} className="text-blue-400" />
                          <span className="text-sm">Twitter</span>
                        </div>
                        <div
                          onClick={() => handleSocialShare("whatsapp")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <FaWhatsapp size={18} className="text-green-500" />
                          <span className="text-sm">WhatsApp</span>
                        </div>
                        <div
                          onClick={handleShareLink}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          {linkCopied ? (
                            <>
                              <FaCheck size={18} className="text-green-500" />
                              <span className="text-sm">Copied!</span>
                            </>
                          ) : (
                            <>
                              <FaCopy size={18} className="text-gray-500" />
                              <span className="text-sm">Copy Link</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all relative overflow-hidden"
                whileHover={{ scale: isDownloading ? 1 : 1.05 }}
                whileTap={{ scale: isDownloading ? 1 : 0.95 }}
                aria-label="Download artwork"
              >
                {isDownloading && (
                  <div
                    className="absolute left-0 top-0 h-full bg-green-500 transition-all"
                    style={{ width: `${downloadProgress}%` }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                  {downloadSuccess ? (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <MdCheckCircle size={18} />
                      <span>Downloaded!</span>
                    </motion.div>
                  ) : isDownloading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{downloadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <FaDownload size={16} />
                      <span>Download</span>
                    </>
                  )}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.getElementById("modal-root")
  );
};

export default FullImageView;
