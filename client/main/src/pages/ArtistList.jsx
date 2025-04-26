import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { FiInstagram, FiFacebook } from "react-icons/fi";
import Pagination from "../components/Pagination";
import { getAllArtists } from "../services/artistService";

function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const imagesCache = useRef(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [artistsPerPage] = useState(9);

  // Handle social media link clicks
  const handleSocialClick = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        // Use our artist service instead of direct axios call
        const data = await getAllArtists();
        setArtists(data);

        // Initialize image loading state for each artist
        const initialImageState = {};
        data.forEach((artist) => {
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();

    return () => {
      // Clean up image references
      imagesCache.current.forEach((img) => {
        img.onload = null;
      });
      imagesCache.current.clear();
    };
  }, []);

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter artists based on search term and specialty
  const filteredArtists = artists.filter((artist) =>
    artist.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current artists for pagination
  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = filteredArtists.slice(
    indexOfFirstArtist,
    indexOfLastArtist
  );

  // Skeleton card for loading state
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-200"></div>
          <div>
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32 mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
          </div>
        </div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-4/6 mb-4"></div>

        {/* Artwork previews skeleton */}
        <div className="mt-4 grid grid-cols-3 gap-1 sm:gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full h-16 sm:h-20 rounded-lg bg-gray-200"
            ></div>
          ))}
        </div>

        {/* Social links skeleton */}
        <div className="flex space-x-2 sm:space-x-3 mt-4">
          <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-15">
          <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-5">
            <div className="h-8 sm:h-10 bg-gray-200 rounded w-32 sm:w-48 mx-auto mb-3 sm:mb-4 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-48 sm:w-64 mx-auto animate-pulse"></div>
          </div>

          {/* Search bar skeleton */}
          <div className="max-w-md mx-auto mb-6 sm:mb-8 lg:mb-12 px-3 sm:px-0">
            <div className="h-10 sm:h-12 bg-gray-200 rounded-full w-full animate-pulse"></div>
          </div>
        </div>

        {/* Artist grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-15">
      <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-5">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-semibold mb-2 sm:mb-4 text-black">
          Our Artists
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 px-3 sm:px-0">
          Discover talented artists from around the world showcasing their
          unique work.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6 sm:mb-8 lg:mb-12 px-3 sm:px-0">
        <div className="relative">
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search artists by name..."
            className="pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-500 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition-all duration-200 shadow-sm hover:shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search artists"
          />
        </div>
      </div>

      {/* Artist List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : filteredArtists.length > 0 ? (
          <>
            {currentArtists.map((artist) => (
              <div
                key={artist._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
                title={`View ${artist.name}'s profile`}
              >
                <div className="p-3 sm:p-4 md:p-6">
                  <Link
                    to={`/artists/${encodeURIComponent(
                      artist.name.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full overflow-hidden bg-indigo-100 flex-shrink-0">
                          <img
                            src={
                              artist.profileImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                artist.name || "Artist"
                              )}&background=6366f1&color=fff&size=256`
                            }
                            alt={artist.name || "Artist profile"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h3 className="capitalize font-medium text-black text-sm sm:text-base md:text-lg group-hover:text-indigo-600 transition-colors">
                            {artist.name}
                          </h3>
                          <div className="flex items-center text-gray-500 text-xs sm:text-sm space-x-2">
                            <span className="flex items-center">
                              {artist.artworks.length}{" "}
                              {artist.artworks.length === 1
                                ? "Artwork"
                                : "Artworks"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Social Links */}
                      {artist.socialLinks &&
                        (artist.socialLinks.instagram ||
                          artist.socialLinks.facebook) && (
                          <div className="flex space-x-2 sm:space-x-3">
                            {artist.socialLinks.instagram && (
                              <a
                                href={artist.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:!text-pink-500 transition-colors p-2 rounded-full hover:bg-gray-100"
                                title="Instagram"
                                onClick={(e) =>
                                  handleSocialClick(
                                    e,
                                    artist.socialLinks.instagram
                                  )
                                }
                                aria-label={`Visit ${artist.name}'s Instagram profile`}
                              >
                                <FiInstagram size={20} />
                              </a>
                            )}
                            {artist.socialLinks.facebook && (
                              <a
                                href={artist.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                                title="Facebook"
                                onClick={(e) =>
                                  handleSocialClick(
                                    e,
                                    artist.socialLinks.facebook
                                  )
                                }
                                aria-label={`Visit ${artist.name}'s Facebook profile`}
                              >
                                <FiFacebook size={20} />
                              </a>
                            )}
                          </div>
                        )}
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-2 sm:mb-3 md:mb-4 capitalize">
                      {artist.bio ||
                        "Talented artist showcasing their creative work."}
                    </p>

                    {/* Artist's Latest Works Preview */}
                    <>
                      <h2 className="font-medium text-gray-800 text-xs sm:text-sm md:text-base">
                        Latest Works
                      </h2>
                      {artist.artworks.length > 0 ? (
                        <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-3 gap-1 sm:gap-2">
                          {artist.artworks
                            .slice(-3)
                            .reverse()
                            .map((artwork) => (
                              <div
                                key={artwork._id}
                                className="w-full h-14 sm:h-16 md:h-20 rounded-lg bg-gray-100 overflow-hidden aspect-square"
                              >
                                {((artwork.images &&
                                  artwork.images.length > 0) ||
                                  artwork.imageUrl) && (
                                  <img
                                    src={
                                      artwork.images &&
                                      artwork.images.length > 0
                                        ? artwork.images[0]
                                        : artwork.imageUrl
                                    }
                                    alt={artwork.title || "Artwork"}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-xs sm:text-sm">
                          No artworks available
                        </p>
                      )}
                    </>
                  </Link>
                </div>
              </div>
            ))}

            {/* Pagination component */}
            <div className="col-span-full">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredArtists.length}
                itemsPerPage={artistsPerPage}
                paginate={paginate}
              />
            </div>
          </>
        ) : (
          <motion.div
            className="text-center py-8 sm:py-12 lg:py-16 rounded-xl mt-4 sm:mt-6 lg:mt-8 col-span-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FaSearch className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto text-indigo-300" />
            <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-medium text-gray-800">
              No artists found
            </h3>
            <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-600 max-w-md mx-auto">
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
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg font-medium text-xs sm:text-sm"
              >
                Clear Search
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ArtistList;
