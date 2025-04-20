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
import LoadingSpinner from "../components/LoadingSpinner";
import ArtworkCard from "../components/ArtworkCard";
import FullImageView from "../components/FullImageView";
import Pagination from "../components/Pagination";
import { getArtistByName } from "../services/artistService";

const StatCard = ({ icon, value, label, className }) => (
  <motion.div
    className={`bg-white p-4 rounded-xl shadow-md flex items-center gap-3 ${className}`}
    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </motion.div>
);

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
  const [loadingImages, setLoadingImages] = useState({});
  const [fullImage, setFullImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage] = useState(6);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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
    if (activeFilter === "all") {
      setFilteredArtworks(artworks);
    } else {
      const filtered = artworks.filter(
        (artwork) => artwork.category === activeFilter
      );
      setFilteredArtworks(filtered);
    }
  }, [activeFilter, artworks]);

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
      top: document.querySelector(".artworks-section").offsetTop - 100,
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Artist Not Found</h2>
        <p className="mb-8">
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
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl overflow-hidden shadow-lg"
      >
        <div className="md:flex p-6 md:p-0">
          <div className="md:w-1/3 flex justify-center items-center p-8 relative">
            <motion.div
              className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden relative shadow-xl ring-8 ring-white/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                  <FaSpinner
                    className="animate-spin text-indigo-500"
                    size={32}
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
          <div className="md:w-2/3 p-8 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 leading-tight">
              {artist.name}
            </h1>
            {artist.specialty && (
              <p className="text-indigo-600 font-medium text-xl mb-4">
                {artist.specialty}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-6">
              {artist.tags &&
                artist.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    className="bg-white/80 backdrop-blur-sm text-indigo-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {tag}
                  </motion.span>
                ))}
            </div>

            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-4">
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
                  <FiInstagram size={20} />
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
                  <FiFacebook size={20} />
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
                  <FiTwitter size={20} />
                </motion.a>
              )}
              {socialLinks.website && (
                <motion.a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                  aria-label="Website"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiGlobe size={20} />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Artist's gallery section */}
      <div className="pt-8 relative artworks-section">
        {/* Gallery header */}
        <motion.div
          className={`bg-white rounded-lg py-3 px-4 w-full mb-5`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <h2 className="text-3xl font-display font-semibold text-gray-900 relative">
              <span className="relative">Artworks</span>
              <span className="absolute -bottom-3 left-0 w-12 h-2 bg-indigo-200 rounded-full z-0"></span>
            </h2>

            {/* Filter section with dropdown */}
            {artworks.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-2 relative"
                ref={dropdownRef}
              >
                <motion.div
                  className="cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all
                    bg-indigo-600 text-white shadow-md hover:bg-indigo-700 flex items-center gap-2"
                  onClick={() => setShowDropdown(!showDropdown)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All ({artworks.length})
                  <span
                    className={`transition-transform duration-300 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  >
                    <FiChevronDown />
                  </span>
                </motion.div>

                {/* Dropdown menu */}
                {showDropdown && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20"
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
                          setFilteredArtworks([...artworks]);
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
                              const filtered = artworks.filter(
                                (artwork) => artwork.category === category
                              );
                              setFilteredArtworks(filtered);
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
            )}
          </div>
        </motion.div>

        {filteredArtworks.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
            <p className="text-gray-500 text-lg">
              {activeFilter === "all"
                ? "No artworks available from this artist yet."
                : `No artworks matching "${activeFilter}" filter.`}
            </p>
            {activeFilter !== "all" && (
              <div
                onClick={() => setActiveFilter("all")}
                className="cursor-pointer mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                Show all artworks
              </div>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max ${
                filterApplied ? "animate-pulse" : ""
              }`}
              layout
            >
              {currentArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork._id}
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
                  className={`${index % 3 === 1 ? "md:mt-8" : ""}`} // Create masonry-like layout
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
            <Pagination
              currentPage={currentPage}
              totalItems={filteredArtworks.length}
              itemsPerPage={artworksPerPage}
              paginate={paginate}
            />
          </AnimatePresence>
        )}
      </div>

      {/* Contact section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-10 shadow-lg text-white overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
        <div className="relative z-10 md:flex items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-3xl font-display font-semibold mb-4">
              Do you have artworks to show ?
            </h2>
            <p className="text-indigo-100 text-lg mb-0">
              Contact me to create your profile.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <a
                href="https://www.instagram.com/mo0o__7lli__/"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiMail size={18} />
                <span>Contact Me</span>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ArtistProfile;
