import React from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSpinner, FaTimes } from "react-icons/fa";
import { MdCategory, MdDescription } from "react-icons/md";
import { IoPricetagOutline } from "react-icons/io5";

const FullImageView = ({
  fullImage,
  closeFullImage,
  loadingImages,
  handleImageLoad,
  handleImageError,
  setShowDeleteConfirm,
}) => {
  const modalRef = React.useRef(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    React.useState(false);

  React.useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  if (!fullImage) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black/50"
      onClick={closeFullImage}
      role="dialog"
      aria-labelledby="artwork-title"
      aria-modal="true"
      tabIndex="-1"
      ref={modalRef}
    >
      <div
        className="relative w-full max-w-7xl max-h-[80vh] flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div
          className="cursor-pointer absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={closeFullImage}
          aria-label="Close full image view"
        >
          <FaTimes size={24} className="text-gray-800" />
        </div>

        {/* Image Section */}
        <div className="relative flex-1 bg-gray-900 flex items-center justify-center min-h-[50vh] md:min-h-[80vh]">
          {loadingImages[fullImage._id] ? (
            <div className="flex items-center justify-center h-full w-full bg-gray-900">
              <div className="relative">
                <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
                <img
                  src={fullImage.imageUrl}
                  alt="Thumbnail"
                  className="absolute inset-0 w-16 h-16 object-cover opacity-50 blur-sm"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={fullImage.imageUrl}
                alt={fullImage.title}
                className="max-w-full max-h-[80vh] object-contain mx-auto"
                onLoad={(e) => handleImageLoad(fullImage._id)}
                onError={() => handleImageError(fullImage._id)}
              />
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-80 bg-white p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <h2
              id="artwork-title"
              className="text-3xl font-bold text-gray-800 mb-4 font-serif capitalize"
            >
              {fullImage.title}
            </h2>
            <div className="space-y-5">
              <div className="flex items-center">
                <MdCategory className="text-indigo-600 mr-2 flex-shrink-0" />
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors">
                  {fullImage.category}
                </span>
              </div>
              {fullImage.description && (
                <div className="flex flex-col">
                  <div className="flex items-start">
                    <MdDescription className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <p
                      className={`text-sm text-gray-600 transition-all duration-300 ${
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
                      className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-6"
                      aria-controls="artwork-description"
                      aria-expanded={isDescriptionExpanded}
                    >
                      {isDescriptionExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              )}

              {/* Technical Details */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100">
                {fullImage.medium && (
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-24">Medium:</span>
                    <span className="text-gray-900 font-medium">
                      {fullImage.medium}
                    </span>
                  </div>
                )}
                {fullImage.dimensions && (
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-24">Dimensions:</span>
                    <span className="text-gray-900 font-medium">
                      {fullImage.dimensions}
                    </span>
                  </div>
                )}
                {fullImage.year && (
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-24">Year:</span>
                    <span className="text-gray-900 font-medium">
                      {fullImage.year}
                    </span>
                  </div>
                )}
                <div className="flex text-sm">
                  <span className="text-gray-500 w-24">Created:</span>
                  <span className="text-gray-900 font-medium">
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
                  <IoPricetagOutline className="text-indigo-600 mr-2 flex-shrink-0" />
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {fullImage.price} EGP
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <Link
              to={`/artwork/edit/${fullImage._id}`}
              className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-indigo-600 rounded-lg shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <FaEdit className="mr-2" />
              Edit Artwork
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(fullImage._id);
                closeFullImage();
              }}
              className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <FaTrash className="mr-2" />
              Delete Artwork
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root"));
};

export default FullImageView;
