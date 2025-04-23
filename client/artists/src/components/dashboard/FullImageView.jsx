import React from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSpinner, FaTimes } from "react-icons/fa";
import { MdCategory, MdDescription, MdDateRange } from "react-icons/md";
import { IoPricetagOutline } from "react-icons/io5";
import { BiImageAlt } from "react-icons/bi";

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
      className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black/70 p-2 sm:p-4"
      onClick={closeFullImage}
      role="dialog"
      aria-labelledby="artwork-title"
      aria-modal="true"
      tabIndex="-1"
      ref={modalRef}
    >
      <div
        className="relative w-full max-w-7xl max-h-[95vh] flex flex-col md:flex-row bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div
          className="cursor-pointer absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={closeFullImage}
          aria-label="Close full image view"
        >
          <FaTimes size={16} className="text-gray-800 sm:text-xl" />
        </div>

        {/* Image Section */}
        <div className="relative flex-[3] bg-gray-900 flex items-center justify-center min-h-[40vh] md:min-h-0">
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
            <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
              <img
                src={fullImage.imageUrl}
                alt={fullImage.title}
                className="max-h-[50vh] w-auto object-contain mx-auto"
                onLoad={(e) => handleImageLoad(fullImage._id)}
                onError={() => handleImageError(fullImage._id)}
              />
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-96 lg:w-[400px] bg-white p-3 sm:p-5 md:p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[95vh]">
          <div className="space-y-4 sm:space-y-6">
            <h2
              id="artwork-title"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-serif capitalize border-b pb-2 border-gray-200"
            >
              {fullImage.title}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <MdCategory className="text-indigo-600 mr-2 flex-shrink-0 text-lg" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Category</p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {fullImage.category}
                  </span>
                </div>
              </div>

              {fullImage.createdAt && (
                <div className="flex items-center">
                  <MdDateRange className="text-indigo-600 mr-2 flex-shrink-0 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Created on</p>
                    <span className="text-sm text-gray-700">
                      {new Date(fullImage.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {fullImage.dimensions && (
                <div className="flex items-center">
                  <BiImageAlt className="text-indigo-600 mr-2 flex-shrink-0 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Dimensions</p>
                    <span className="text-sm text-gray-700">
                      {fullImage.dimensions}
                    </span>
                  </div>
                </div>
              )}

              {fullImage.isForSale && fullImage.price && (
                <div className="flex items-center">
                  <IoPricetagOutline className="text-indigo-600 mr-2 flex-shrink-0 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Price</p>
                    <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {fullImage.price} EGP
                    </span>
                  </div>
                </div>
              )}

              {fullImage.description && (
                <div className="flex flex-col mt-2 border-t pt-4 border-gray-100">
                  <div className="flex items-start">
                    <MdDescription className="text-indigo-600 mr-2 mt-1 flex-shrink-0 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p
                        className={`text-sm text-gray-600 transition-all duration-300 ${
                          !isDescriptionExpanded &&
                          fullImage.description.length > 100
                            ? "line-clamp-4"
                            : ""
                        }`}
                        id="artwork-description"
                      >
                        {fullImage.description}
                      </p>
                      {fullImage.description.length > 100 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDescriptionExpanded(!isDescriptionExpanded);
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          aria-controls="artwork-description"
                          aria-expanded={isDescriptionExpanded}
                        >
                          {isDescriptionExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400 italic">
            Artwork ID: {fullImage._id?.substring(0, 8) || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root"));
};

export default FullImageView;
