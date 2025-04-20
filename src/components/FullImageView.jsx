import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
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
      if (e.key === "Escape") {
        if (showShareOptions) {
          setShowShareOptions(false);
        } else {
          closeFullImage();
        }
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

    if (showShareOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareOptions]);

  if (!fullImage) return null;

  const handleDownload = async () => {
    if (isDownloading) return; // Prevent multiple clicks

    try {
      setIsDownloading(true);
      setDownloadProgress(10);

      // Fetch the image
      const response = await fetch(fullImage.imageUrl);

      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      setDownloadProgress(50);

      // Convert to blob
      const blob = await response.blob();
      setDownloadProgress(80);

      // Create object URL
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fullImage.title || "artwork"}.jpg`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadProgress(100);
      setDownloadSuccess(true);

      // Reset after a delay
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

  const handleShare = () => {
    // Toggle share options if already open
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

          <div className="relative flex-1 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center h-[60vh] w-[60vw] overflow-hidden">
            {isLoading && !imageError && (
              <div className="flex flex-col items-center justify-center h-full w-full bg-gray-950 text-gray-400">
                <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200/30 rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-indigo-300">
                  Loading artwork...
                </p>
              </div>
            )}
            {imageError ? (
              <div className="flex flex-col items-center justify-center h-full w-full bg-gray-950 text-gray-400">
                <FaTimes size={32} className="text-red-500 mb-3" />
                <p className="text-lg font-medium">Failed to load image</p>
                <p className="text-sm text-gray-500 mt-2">
                  The artwork could not be displayed
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isLoading ? 0 : 1,
                  scale: isLoading ? 0.95 : 1,
                  y: isLoading ? 20 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <img
                  src={
                    fullImage.images && fullImage.images.length > 0
                      ? fullImage.images[0]
                      : fullImage.imageUrl
                  }
                  alt={`Artwork titled ${fullImage.title}`}
                  className="max-w-full max-h-full object-contain select-none shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.5))",
                  }}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-xl shadow-xl border border-white/10 overflow-hidden"
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <motion.div
                      className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-transparent"
                      animate={{
                        x: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="bg-purple-600/30 p-2 rounded-full">
                        <IoPricetagOutline
                          className="text-purple-300 flex-shrink-0"
                          size={24}
                        />
                      </div>
                      <div>
                        <span className="text-xl font-bold text-white">
                          {fullImage.price}{" "}
                          <span className="text-purple-300">EGP</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          <motion.div
            className="w-full md:w-96 bg-white dark:bg-gray-900 p-8 flex flex-col justify-between overflow-y-auto border-l border-gray-200 dark:border-gray-700"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <div className="flex flex-col justify-between items-start mb-8">
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full"
                >
                  <h1
                    className="text-4xl font-bold text-gray-800 dark:text-gray-100 capitalize 
                               hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors
                               pb-2 relative group"
                  >
                    {fullImage.title}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-600 dark:bg-indigo-400 
                                   group-hover:w-full transition-all duration-300 rounded"
                    ></span>
                  </h1>
                </motion.div>
              </div>

              <div className="space-y-6">
                {fullImage.artist && (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex items-center gap-3 flex-wrap p-3 bg-gray-50 dark:bg-gray-800/50 
                           rounded-lg border-l-4 border-indigo-500 dark:border-indigo-400 
                           shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="bg-indigo-100 dark:bg-indigo-900/70 p-2 rounded-full">
                      <MdPerson
                        className="text-indigo-600 dark:text-indigo-400 flex-shrink-0"
                        size={24}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Artist
                      </span>
                      <h4 className="text-gray-900 dark:text-gray-200 font-medium">
                        {fullImage.artist.name}
                      </h4>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-center gap-3 flex-wrap p-3 bg-gray-50 dark:bg-gray-800/50 
                           rounded-lg border-l-4 border-green-500 dark:border-green-400 
                           shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-green-100 dark:bg-green-900/70 p-2 rounded-full">
                    <MdCategory
                      className="text-green-600 dark:text-green-400 flex-shrink-0"
                      size={24}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Category
                    </span>
                    <span className="inline-flex items-center rounded-full font-medium">
                      {fullImage.category}
                    </span>
                  </div>
                </motion.div>

                {fullImage.description && (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 
                             rounded-lg border-l-4 border-amber-500 dark:border-amber-400 
                             shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="bg-amber-100 dark:bg-amber-900/70 p-2 rounded-full">
                      <MdDescription
                        className="text-amber-600 dark:text-amber-400 flex-shrink-0"
                        size={24}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Description
                      </span>

                      <p
                        className={`capitalize transition-all duration-300 ${
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
                        className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 mt-2 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ml-10"
                        aria-controls="artwork-description"
                        aria-expanded={isDescriptionExpanded}
                      >
                        {isDescriptionExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </motion.div>
                )}

                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center gap-3 flex-wrap p-3 bg-gray-50 dark:bg-gray-800/50 
                           rounded-lg border-l-4 border-blue-500 dark:border-blue-400 
                           shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/70 p-2 rounded-full">
                    <MdCalendarToday
                      className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                      size={24}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Created
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
                </motion.div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <motion.div className="relative flex-1">
                <motion.button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg shadow-indigo-500/30 font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Share artwork"
                  aria-expanded={showShareOptions}
                >
                  <FaShare size={18} />
                  <span>Share</span>
                </motion.button>
                <AnimatePresence>
                  {showShareOptions && (
                    <motion.div
                      ref={shareMenuRef}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10 w-full"
                    >
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleSocialShare("facebook")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <FaFacebook size={20} className="text-blue-600" />
                          <span>Facebook</span>
                        </button>
                        <button
                          onClick={() => handleSocialShare("twitter")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <FaTwitter size={20} className="text-blue-400" />
                          <span>Twitter</span>
                        </button>
                        <button
                          onClick={() => handleSocialShare("whatsapp")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <FaWhatsapp size={20} className="text-green-500" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={handleShareLink}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {linkCopied ? (
                            <>
                              <FaCheck size={20} className="text-green-500" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <FaCopy size={20} className="text-gray-500" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg shadow-gray-500/30 font-medium relative overflow-hidden"
                whileHover={{
                  scale: isDownloading ? 1 : 1.05,
                  y: isDownloading ? 0 : -2,
                }}
                whileTap={{ scale: isDownloading ? 1 : 0.95 }}
                aria-label="Download artwork"
              >
                {isDownloading && (
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {downloadSuccess ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <MdCheckCircle size={20} className="text-white" />
                      <span>Downloaded!</span>
                    </motion.div>
                  ) : isDownloading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{downloadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <FaDownload size={18} />
                      <span>Download</span>
                    </>
                  )}
                </span>
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
