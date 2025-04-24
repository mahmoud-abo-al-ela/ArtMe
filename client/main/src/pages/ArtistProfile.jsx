import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiGlobe,
  FiMail,
  FiArrowLeft,
  FiChevronDown,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import ArtworkCard from "../components/ArtworkCard";
import FullImageView from "../components/FullImageView";
import Pagination from "../components/Pagination";
import { getArtistByName } from "../services/artistService";

function ArtistProfile() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterApplied, setFilterApplied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [activeSortOption, setActiveSortOption] = useState("newest");
  const [sortApplied, setSortApplied] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});
  const [fullImage, setFullImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage] = useState(6);

  const dropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, sortDropdownRef]);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);

        // Get artist using our service
        const artistData = await getArtistByName(name);
        setArtist(artistData);

        // Use artworks from artist response
        const artworksData = artistData.artworks || [];
        setArtworks(artworksData);
        setFilteredArtworks(artworksData);

        // Initialize loading state for all artwork images
        const initialLoadingState = {};
        artworksData.forEach((artwork) => {
          initialLoadingState[artwork._id] = true;
        });
        setLoadingImages(initialLoadingState);
      } catch (err) {
        console.error("Error fetching artist data:", err);
        setArtist(null);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchArtistData();
    }
  }, [name, navigate]);

  // Filter artworks when active filter changes
  useEffect(() => {
    let filtered = [];
    if (activeFilter === "all") {
      filtered = [...artworks];
    } else {
      filtered = artworks.filter(
        (artwork) => artwork.category === activeFilter
      );
    }

    // Apply current sorting to the filtered results
    sortArtworks(filtered, activeSortOption);
  }, [activeFilter, artworks, activeSortOption]);

  // Function to sort artworks
  const sortArtworks = (artworksToSort, sortOption) => {
    let sorted = [...artworksToSort];

    switch (sortOption) {
      case "newest":
        sorted.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
        break;
      default:
        // Default to newest
        sorted.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    setFilteredArtworks(sorted);
  };

  // Apply sort when sort option changes
  const applySorting = (sortOption) => {
    setActiveSortOption(sortOption);
    setSortApplied(true);
    setTimeout(() => setSortApplied(false), 800);
    setShowSortDropdown(false);
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Get unique categories for filtering
  const getFilterOptions = () => {
    const categories = new Set();

    artworks.forEach((artwork) => {
      if (artwork.category) {
        categories.add(artwork.category);
      }
    });

    return {
      categories: Array.from(categories),
    };
  };

  const handleImageLoad = (id) => {
    setLoadingImages((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const handleImageError = (id) => {
    setLoadingImages((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const handleImageClick = (artwork) => {
    setFullImage(artwork);
  };

  const closeFullImage = () => {
    setFullImage(null);
  };

  const setShowDeleteConfirm = () => {
    console.log("Delete functionality not implemented in Artist Profile page");
    closeFullImage();
  };

  // Get current artworks for pagination
  const indexOfLastArtwork = currentPage * artworksPerPage;
  const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
  const currentArtworks = filteredArtworks.slice(
    indexOfFirstArtwork,
    indexOfLastArtwork
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of gallery section
    window.scrollTo({
      top: document.querySelector(".artworks-section")?.offsetTop - 100 || 0,
      behavior: "smooth",
    });
  };

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 mt-15">
        {/* Back to Artists Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            to="/artists"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md font-medium"
          >
            <FiArrowLeft /> All Artists
          </Link>
        </motion.div>

        {/* Skeleton for Artist Profile */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl overflow-hidden shadow-lg animate-pulse">
          <div className="md:flex p-6 md:p-0">
            <div className="md:w-1/3 flex justify-center items-center p-8">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gray-200"></div>
            </div>
            <div className="md:w-2/3 p-8 flex flex-col justify-center">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="flex flex-wrap gap-2 mb-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-200 rounded-full w-20"
                  ></div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="flex mt-6 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gray-200"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton for Artworks section */}
        <div className="pt-8">
          <div className="bg-white rounded-lg py-3 px-4 w-full mb-5">
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-md"
              >
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center mt-15">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">
          Artist Not Found
        </h2>
        <p className="mb-8 text-indigo-600">
          The artist you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/artists"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <FiArrowLeft /> Back to Artists
        </Link>
      </div>
    );
  }

  const profileImage =
    artist.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      artist.name || "Artist"
    )}&background=6366f1&color=fff&size=256`;

  // Extract social links
  const socialLinks = artist.socialLinks || {};

  // Filter options
  const filterOptions = getFilterOptions();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-12 mt-15">
      {/* Back to Artists Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-2 sm:mb-6"
      >
        <Link
          to="/artists"
          className="inline-flex items-center gap-2 bg-white text-indigo-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md font-medium text-sm"
        >
          <FiArrowLeft /> All Artists
        </Link>
      </motion.div>

      {fullImage && (
        <FullImageView
          fullImage={fullImage}
          closeFullImage={closeFullImage}
          loadingImages={loadingImages}
          handleImageLoad={handleImageLoad}
          handleImageError={handleImageError}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}

      {/* Artist profile header - Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
      >
        <div className="flex flex-col md:flex-row">
          {/* Mobile profile section with better spacing */}
          <div className="w-full flex flex-col items-center p-6 pt-8 pb-4 md:w-1/3 md:p-8">
            <motion.div
              className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden relative shadow-xl ring-4 ring-white/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                  <FaSpinner
                    className="animate-spin text-indigo-500"
                    size={24}
                  />
                </div>
              )}
              <img
                src={profileImage}
                alt={artist.name}
                className={`w-full h-full object-cover rounded-full transition-all duration-500 ${
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
          </div>

          {/* Info section with better mobile spacing */}
          <div className="w-full px-6 pb-6 md:w-2/3 md:p-8 md:pt-8 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 leading-tight text-center md:text-left">
              {artist.name}
            </h2>

            <div className="prose prose-lg max-w-none mb-5 sm:mb-6 text-center md:text-left">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                {artist.bio ||
                  "Talented artist showcasing their creative work."}
              </p>
            </div>

            {/* Statistics row - only on mobile */}
            <div className="flex justify-center md:hidden mb-5 gap-6">
              <div className="flex flex-col items-center">
                <span className="font-bold text-indigo-600">
                  {artworks.length}
                </span>
                <span className="text-xs text-gray-600">Artworks</span>
              </div>
              {artist.followers !== undefined && (
                <div className="flex flex-col items-center">
                  <span className="font-bold text-indigo-600">
                    {artist.followers}
                  </span>
                  <span className="text-xs text-gray-600">Followers</span>
                </div>
              )}
              {artist.location && (
                <div className="flex flex-col items-center">
                  <span className="font-bold text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-xs text-gray-600">
                    {artist.location}
                  </span>
                </div>
              )}
            </div>

            {/* Social links with better mobile sizing */}
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              {socialLinks.instagram && (
                <motion.a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all shadow-sm"
                  aria-label="Instagram"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiInstagram size={18} className="sm:text-lg" />
                </motion.a>
              )}
              {socialLinks.facebook && (
                <motion.a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                  aria-label="Facebook"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiFacebook size={18} className="sm:text-lg" />
                </motion.a>
              )}
              {socialLinks.twitter && (
                <motion.a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 hover:text-blue-400 hover:bg-blue-50 transition-all shadow-sm"
                  aria-label="Twitter"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiTwitter size={18} className="sm:text-lg" />
                </motion.a>
              )}
              {socialLinks.website && (
                <motion.a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-all shadow-sm"
                  aria-label="Website"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiGlobe size={18} className="sm:text-lg" />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Artist's gallery section */}
      <div className="pt-4 sm:pt-8 relative artworks-section">
        {/* Gallery header */}
        <motion.div
          className={`bg-white rounded-lg py-3 px-4 w-full mb-5`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900 relative">
              <span className="relative">Artworks</span>
              <span className="absolute -bottom-2 sm:-bottom-3 left-0 w-12 h-2 bg-indigo-200 rounded-full z-0"></span>
            </h2>

            {/* Controls section with filter and sort dropdowns */}
            {artworks.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                {/* Filter dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.div
                    className="cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all
                      bg-indigo-600 text-white shadow-md hover:bg-indigo-700 flex items-center gap-2"
                    onClick={() => setShowDropdown(!showDropdown)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeFilter === "all" ? "All Categories" : activeFilter} (
                    {activeFilter === "all"
                      ? artworks.length
                      : filteredArtworks.length}
                    )
                    <span
                      className={`transition-transform duration-300 ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    >
                      <FiChevronDown />
                    </span>
                  </motion.div>

                  {/* Filter dropdown menu */}
                  {showDropdown && (
                    <motion.div
                      className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-1">
                        <div
                          className={`cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${
                            activeFilter === "all"
                              ? "bg-indigo-100 text-indigo-600 font-medium"
                              : "text-gray-700"
                          }`}
                          onClick={() => {
                            setActiveFilter("all");
                            setShowDropdown(false);
                            setFilterApplied(true);
                            setTimeout(() => setFilterApplied(false), 800);
                          }}
                        >
                          All Categories
                        </div>

                        {/* List all categories together */}
                        <div className="border-t border-gray-100 my-1"></div>

                        {/* Combined list of unique categories */}
                        {filterOptions.categories.map((category) => {
                          // Count artworks in this category
                          const count = artworks.filter(
                            (artwork) => artwork.category === category
                          ).length;

                          return (
                            <div
                              key={category}
                              className={`cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${
                                activeFilter === category
                                  ? "bg-indigo-100 text-indigo-600 font-medium"
                                  : "text-gray-700"
                              } flex justify-between items-center`}
                              onClick={() => {
                                setActiveFilter(category);
                                setShowDropdown(false);
                                setFilterApplied(true);
                                setTimeout(() => setFilterApplied(false), 800);
                              }}
                            >
                              <span>{category}</span>
                              <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="relative" ref={sortDropdownRef}>
                  <motion.div
                    className="cursor-pointer px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all
                      bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-1 sm:gap-2"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sort: {getSortLabel(activeSortOption)}
                    <span
                      className={`transition-transform duration-300 ${
                        showSortDropdown ? "rotate-180" : ""
                      }`}
                    >
                      <FiChevronDown />
                    </span>
                  </motion.div>

                  {/* Sort dropdown menu */}
                  {showSortDropdown && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-44 bg-white rounded-lg shadow-lg overflow-hidden z-20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-1">
                        {[
                          { id: "newest", label: "Newest First" },
                          { id: "oldest", label: "Oldest First" },
                        ].map((option) => (
                          <div
                            key={option.id}
                            className={`cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${
                              activeSortOption === option.id
                                ? "bg-indigo-100 text-indigo-600 font-medium"
                                : "text-gray-700"
                            }`}
                            onClick={() => applySorting(option.id)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {filteredArtworks.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
            <p className="text-gray-500 text-lg">
              {activeFilter === "all"
                ? "No artworks available from this artist yet."
                : `No artworks matching "${activeFilter}" filter.`}
            </p>
            {activeFilter !== "all" && (
              <div
                onClick={() => setActiveFilter("all")}
                className="cursor-pointer mx-auto mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all inline-block"
              >
                Show all artworks
              </div>
            )}
          </div>
        ) : (
          <AnimatePresence key={`${activeFilter}-${activeSortOption}`}>
            <motion.div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 auto-rows-max ${
                filterApplied || sortApplied ? "animate-pulse" : ""
              }`}
              layout
            >
              {currentArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork._id ? artwork._id : `artwork-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05, // Staggered animation
                    layout: { type: "spring", damping: 15 },
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`${index % 3 === 1 ? "sm:mt-4 md:mt-8" : ""}`} // Create masonry-like layout
                >
                  <ArtworkCard
                    artwork={artwork}
                    loadingImages={loadingImages}
                    handleImageLoad={handleImageLoad}
                    handleImageError={handleImageError}
                    handleImageClick={handleImageClick}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <motion.div
              key="pagination"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 sm:mt-8"
            >
              <Pagination
                currentPage={currentPage}
                totalItems={filteredArtworks.length}
                itemsPerPage={artworksPerPage}
                paginate={paginate}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Contact section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 sm:mt-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl sm:rounded-2xl p-5 sm:p-10 shadow-lg text-white overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
        <div className="relative z-10 md:flex items-center justify-between">
          <div className="md:w-2/3 mb-4 md:mb-0">
            <h2 className="text-xl sm:text-3xl font-display font-semibold mb-2 sm:mb-4">
              Do you have artworks to show?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-lg mb-0">
              Contact me to create your profile.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <a
                href="https://www.instagram.com/mo0o__7lli__/"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiMail size={16} className="sm:text-lg" />
                <span>Contact Me</span>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function getSortLabel(sortOption) {
  switch (sortOption) {
    case "newest":
      return "Newest";
    case "oldest":
      return "Oldest";
    default:
      return "Newest";
  }
}

export default ArtistProfile;
