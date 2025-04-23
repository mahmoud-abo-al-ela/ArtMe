import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
import { IoPricetagOutline } from "react-icons/io5";

const ArtworkCard = ({
  artwork,
  loadingImages,
  handleImageClick,
  setShowDeleteConfirm,
  handleImageLoad,
  handleImageError,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleMobileMenuToggle = (e) => {
    e.stopPropagation();
    setShowMobileMenu(!showMobileMenu);
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMobileMenu &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showMobileMenu]);

  return (
    <div
      key={artwork._id}
      className="bg-white rounded-lg shadow-lg overflow-hidden art-card border border-gray-100 transition-all duration-300 active:shadow-inner hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 group relative"
    >
      <div
        className="relative overflow-hidden h-52 sm:h-56 md:h-64 cursor-pointer"
        onClick={() => {
          !loadingImages[artwork._id] && handleImageClick(artwork);
          setShowMobileMenu(false);
        }}
      >
        {loadingImages[artwork._id] && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse">
            <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300"></div>
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-gray-800/50 to-transparent">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="capitalize text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2 md:transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
            {artwork.title}
          </h3>
          <p className="text-white/90 mb-1 text-xs sm:text-sm md:transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300 delay-75">
            Created on{" "}
            {new Date(artwork.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 max-w-[75%]">
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
        {!loadingImages[artwork._id] && (
          <>
            {/* Desktop buttons - visible on md and above */}
            <div className="absolute top-3 right-3 z-10 hidden md:flex space-x-3">
              <Link
                to={`/artwork/edit/${artwork._id}`}
                className="text-indigo-500 cursor-pointer w-9 h-9 flex items-center justify-center bg-white/90 rounded-full hover:bg-white active:bg-indigo-50 transition-colors shadow-md"
                onClick={(e) => e.stopPropagation()}
                title="Edit Artwork"
                aria-label="Edit Artwork"
              >
                <FaEdit size={18} />
              </Link>
              <div
                className="text-red-500 cursor-pointer w-9 h-9 flex items-center justify-center bg-white/90 rounded-full hover:bg-white active:bg-red-50 transition-colors shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(artwork._id);
                }}
                title="Delete Artwork"
                aria-label="Delete artwork"
              >
                <FaTrash size={18} />
              </div>
            </div>

            {/* Mobile menu button - visible below md */}
            <div className="absolute top-3 right-3 z-10 md:hidden">
              <div
                ref={menuButtonRef}
                className="text-gray-700 cursor-pointer w-7 h-7 flex items-center justify-center bg-white/90 rounded-full hover:bg-white active:bg-gray-100 transition-colors shadow-md"
                onClick={handleMobileMenuToggle}
                title="Options"
                aria-label="Artwork options"
              >
                <FaEllipsisV size={16} />
              </div>

              {/* Mobile menu dropdown */}
              {showMobileMenu && (
                <div
                  ref={mobileMenuRef}
                  className="absolute top-full right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      to={`/artwork/edit/${artwork._id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={(e) => e.stopPropagation()}
                      role="menuitem"
                    >
                      <FaEdit className="mr-2 text-indigo-500" />
                      Edit
                    </Link>
                    <div
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(artwork._id);
                        setShowMobileMenu(false);
                      }}
                      role="menuitem"
                    >
                      <FaTrash className="mr-2 text-red-500" />
                      Delete
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArtworkCard;
