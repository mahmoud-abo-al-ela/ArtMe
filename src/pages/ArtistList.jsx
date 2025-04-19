import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import { FiInstagram, FiFacebook } from "react-icons/fi";

function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const imagesCache = useRef(new Map());

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/artists`
        );
        setArtists(res.data);

        // Initialize image loading state for each artist
        const initialImageState = {};
        res.data.forEach((artist) => {
          const imageUrl =
            artist.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              artist.name || "Artist"
            )}&background=6366f1&color=fff&size=256`;

          // Check if image is already in browser cache
          const img = new Image();
          img.src = imageUrl;

          // If image is complete immediately, it's cached
          initialImageState[artist._id] = !img.complete;

          // Store image reference
          imagesCache.current.set(artist._id, img);
        });
        setImageLoading(initialImageState);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();

    // Handle scroll for sticky header effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);

      // Clean up image references
      imagesCache.current.forEach((img) => {
        img.onload = null;
      });
      imagesCache.current.clear();
    };
  }, []);

  const handleImageLoaded = (artistId) => {
    setImageLoading((prev) => ({
      ...prev,
      [artistId]: false,
    }));
  };

  // Check if image is already cached before actual load
  const checkImageCached = (artistId, imageUrl) => {
    // If we already checked this image and knew it's loading status
    if (imagesCache.current.has(artistId)) {
      return;
    }

    const img = new Image();
    img.onload = () => handleImageLoaded(artistId);
    img.src = imageUrl;
    imagesCache.current.set(artistId, img);
  };

  // Filter artists based on search term and specialty
  const filteredArtists = artists.filter((artist) =>
    artist.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton card for loading state
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.5 6.5L15.5 3.5C15.1 3.1 14.5 3 14 3H6C5.5 3 5 3.5 5 4V20C5 20.5 5.5 21 6 21H18C18.5 21 19 20.5 19 20V8C19 7.5 18.9 6.9 18.5 6.5ZM17 20H7V4H13V7C13 7.6 13.4 8 14 8H17V20ZM8 13.5C8 12.1 9.1 11 10.5 11C11.9 11 13 12.1 13 13.5C13 14.9 11.9 16 10.5 16C9.1 16 8 14.9 8 13.5ZM18 18H14.8C14.6 16.8 13.7 15.9 12.5 15.7V15C12.5 14.4 12.1 14 11.5 14H9.5C8.9 14 8.5 14.4 8.5 15V15.7C7.3 15.9 6.4 16.8 6.2 18H3V19H18V18Z"></path>
        </svg>
      </div>
      <div className="p-6">
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="h-12 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="mt-4 md:mt-0">
            <div className="h-12 bg-gray-200 rounded-full w-72 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10">
      <div
        className={`sticky top-0 z-10 backdrop-blur-md py-4 mb-8 transition-all duration-300 ${
          isScrolled ? "shadow-md rounded-lg" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-4xl font-bold text-gray-800">Discover Artists</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-800 pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-72 transition-all duration-200 shadow-sm hover:shadow-md"
              />
              {searchTerm && (
                <div
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <FaTimes className="text-gray-500 hover:text-gray-700" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {filteredArtists.map((artist, index) => {
          const imageUrl =
            artist.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              artist.name || "Artist"
            )}&background=6366f1&color=fff&size=256`;

          // Pre-check image cache status when the component renders
          if (imageLoading[artist._id]) {
            checkImageCached(artist._id, imageUrl);
          }

          return (
            <motion.div
              key={artist._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100 hover:border-indigo-200">
                <div className="relative overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                    {imageLoading[artist._id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="animate-pulse flex flex-col items-center">
                          <FaSpinner className="animate-spin w-8 h-8 text-gray-400" />
                          <span className="mt-2 text-xs text-gray-500">
                            Loading...
                          </span>
                        </div>
                      </div>
                    )}
                    <img
                      src={imageUrl}
                      alt={artist.name}
                      className={`w-full h-64 object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-in-out ${
                        imageLoading[artist._id] ? "opacity-0" : "opacity-100"
                      }`}
                      loading="eager"
                      onLoad={() => handleImageLoaded(artist._id)}
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span className="bg-indigo-600/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        {artist.artworks.length}{" "}
                        {artist.artworks.length === 1 ? "artwork" : "artworks"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-grow flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {artist.name}
                    </h2>
                    <div className="mt-3">
                      <p className="text-gray-600 line-clamp-3 text-sm">
                        {artist.bio ? artist.bio : "No bio available"}
                      </p>
                    </div>
                  </div>
                  {artist?.socialLinks &&
                    Object.values(artist?.socialLinks).some((link) => link) && (
                      <div className="pt-2">
                        <div className="flex space-x-4">
                          {artist?.socialLinks?.instagram && (
                            <a
                              href={artist?.socialLinks?.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300"
                              title="Instagram"
                            >
                              <FiInstagram size={20} className="text-white" />
                            </a>
                          )}

                          {artist?.socialLinks?.facebook && (
                            <a
                              href={artist?.socialLinks?.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white hover:shadow-lg transition-all duration-300"
                              title="Facebook"
                            >
                              <FiFacebook size={20} className="text-white" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredArtists.length === 0 && (
        <motion.div
          className="text-center py-16 rounded-xl mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaSearch className="w-20 h-20 mx-auto text-indigo-300" />
          <h3 className="mt-4 text-xl font-medium text-gray-800">
            No artists found
          </h3>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">
            {searchTerm
              ? "No artists match your search criteria."
              : "Check back soon for our featured artists!"}
          </p>
          {searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm("");
              }}
              className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg font-medium text-sm"
            >
              Clear Search
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default ArtistList;
