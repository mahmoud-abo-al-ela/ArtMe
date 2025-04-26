import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";
import FullImageView from "../components/FullImageView";
import ArtworkCard from "../components/ArtworkCard";
import Pagination from "../components/Pagination";

// Skeleton loader component for artwork cards
const ArtworkSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden art-card border border-gray-100 transition-all duration-300">
      <div className="relative overflow-hidden h-64">
        <div className="absolute inset-0 bg-gray-100 animate-pulse">
          <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-800/50 to-transparent">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-5 bg-white/30 rounded-md w-3/4 mb-2"></div>
              <div className="h-4 bg-white/20 rounded-md w-2/4"></div>
            </div>
          </div>
        </div>
        <div className="absolute top-3 left-3 z-10 flex space-x-2">
          <div className="h-6 w-20 bg-indigo-100/50 animate-pulse rounded-full"></div>
          <div className="h-6 w-24 bg-green-100/50 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    searchTerm: "",
  });
  const [tempFilters, setTempFilters] = useState({
    category: "",
    searchTerm: "",
  });
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage] = useState(9);
  const [sortBy, setSortBy] = useState("latest");
  const [tempSortBy, setTempSortBy] = useState("latest");
  const [loadingImages, setLoadingImages] = useState({});
  const [fullImage, setFullImage] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/artworks`);
        setArtworks(res.data);
        setFilteredArtworks(res.data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(res.data.map((artwork) => artwork.category)),
        ];
        setCategories(uniqueCategories);

        // Initialize loading state for all artwork images
        const initialLoadingState = {};
        res.data.forEach((artwork) => {
          initialLoadingState[artwork._id] = true;
        });
        setLoadingImages(initialLoadingState);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter state changes
    let results = [...artworks];

    if (filters.category) {
      results = results.filter(
        (artwork) => artwork.category === filters.category
      );
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchLower) ||
          artwork.artist.name.toLowerCase().includes(searchLower) ||
          (artwork.description &&
            artwork.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort results based on sortBy value
    if (sortBy === "latest") {
      results.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    } else if (sortBy === "oldest") {
      results.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
    }

    setFilteredArtworks(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, artworks, sortBy]);

  useEffect(() => {
    // Initialize tempFilters with current filters when opening the filter panel
    if (showFilters) {
      setTempFilters({ ...filters });
      setTempSortBy(sortBy);
    }
  }, [showFilters, filters, sortBy]);

  const handleCategoryChange = (e) => {
    if (isMobile) {
      setTempFilters({
        ...tempFilters,
        category: e.target.value,
      });
    } else {
      setFilters({
        ...filters,
        category: e.target.value,
      });
    }
  };

  const handleSearchChange = (e) => {
    if (isMobile) {
      setTempFilters({
        ...tempFilters,
        searchTerm: e.target.value,
      });
    } else {
      setFilters({
        ...filters,
        searchTerm: e.target.value,
      });
    }
  };

  const handleSortChange = (e) => {
    if (isMobile) {
      setTempSortBy(e.target.value);
    } else {
      setSortBy(e.target.value);
    }
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setSortBy(tempSortBy);
    setShowFilters(false);
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
    // This is a placeholder. In the Gallery page, we probably don't want to enable deletion
    console.log("Delete functionality not implemented in Gallery page");
    closeFullImage();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    if (isMobile) {
      setTempFilters({ category: "", searchTerm: "" });
      setTempSortBy("latest");
    } else {
      setFilters({ category: "", searchTerm: "" });
      setSortBy("latest");
    }
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
    // Scroll to top on mobile when changing pages
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const hasActiveFilters =
    filters.category || filters.searchTerm || sortBy !== "latest";

  if (loading)
    return (
      <>
        {/* Header Skeleton */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-15">
          <div className="text-center max-w-3xl mx-auto mb-5">
            <div className="text-2xl sm:text-3xl lg:text-5xl text-black font-display font-semibold mb-4">
              Artwork Gallery
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-500">
              Explore our curated collection of exceptional artwork from
              talented artists around the world.
            </div>
          </div>

          {/* Search and Filter Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <ArtworkSkeleton key={index} />
            ))}
          </div>
        </div>
      </>
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-15 relative">
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

      <div className="text-center max-w-3xl mx-auto mb-5">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl text-black font-display font-semibold mb-4">
          Artworks
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-500">
          Explore our curated collection of exceptional artwork from talented
          artists around the world.
        </p>
      </div>

      {/* Mobile Filter Toggle Button */}
      {!showFilters && (
        <div className="md:hidden fixed bottom-18 right-6 z-30">
          <div
            onClick={toggleFilters}
            className={`p-3 rounded-full shadow-lg flex items-center justify-center ${
              hasActiveFilters ? "bg-indigo-600" : "bg-white"
            }`}
          >
            <FaFilter
              className={`${
                hasActiveFilters ? "text-white" : "text-indigo-600"
              }`}
            />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                !
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search and Filter - Desktop always visible, Mobile slide-up panel */}
      <div
        className={`
        md:bg-white md:rounded-lg md:shadow-sm md:p-6 md:mb-12
        md:static md:block md:opacity-100 md:pointer-events-auto md:h-auto md:translate-y-0
        md:transition-none
        ${
          showFilters
            ? "fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-5 z-80 transform translate-y-0 opacity-100 pointer-events-auto"
            : "fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-5 z-80 transform translate-y-full opacity-0 pointer-events-none"
        } transition-all duration-300 ease-in-out
      `}
      >
        {/* Mobile header with close button */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h3 className="font-semibold text-lg">Filters & Sort</h3>
          <div className="flex items-center gap-3">
            {(tempFilters.category ||
              tempFilters.searchTerm ||
              tempSortBy !== "latest") && (
              <div
                onClick={clearFilters}
                className="text-sm text-indigo-600 flex items-center gap-1"
              >
                <FaTimes size={12} /> Clear all
              </div>
            )}
            <div onClick={toggleFilters} className="text-gray-500">
              <FaTimes size={20} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Search */}
          <div className="relative">
            <FaSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search artworks or artists..."
              className="w-full text-gray-500 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={isMobile ? tempFilters.searchTerm : filters.searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FaFilter
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <select
              className="w-full text-gray-500 pl-10 pr-4 py-2 max-h-10 overflow-y-auto border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              value={isMobile ? tempFilters.category : filters.category}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <FaChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          {/* Sort By */}
          <div className="relative">
            <FaSort
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <select
              className="w-full text-gray-500 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              value={isMobile ? tempSortBy : sortBy}
              onChange={handleSortChange}
            >
              <option value="latest">Sort by Latest</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
          </div>
        </div>

        {/* Mobile: Apply Filters Button */}
        <div className="mt-4 md:hidden">
          <div
            onClick={applyFilters}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium text-center"
          >
            Apply Filters
          </div>
        </div>
      </div>

      {/* Overlay for mobile filter */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={toggleFilters}
        ></div>
      )}

      {filteredArtworks.length > 0 ? (
        <>
          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="bg-indigo-50 rounded-lg p-3 mb-6 flex justify-between items-center">
              <div className="text-sm text-indigo-700">
                <span className="font-medium">Filters applied:</span>{" "}
                {filters.category && (
                  <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                    {filters.category}
                  </span>
                )}
                {filters.searchTerm && (
                  <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                    "{filters.searchTerm}"
                  </span>
                )}
                {sortBy !== "latest" && (
                  <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                    Oldest First
                  </span>
                )}
              </div>
              <div
                onClick={clearFilters}
                className="text-indigo-600 text-sm font-medium flex items-center"
              >
                Clear <FaTimes className="ml-1" size={12} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork._id}
                artwork={artwork}
                loadingImages={loadingImages}
                handleImageClick={handleImageClick}
                handleImageLoad={handleImageLoad}
                handleImageError={handleImageError}
              />
            ))}
          </div>

          {/* Pagination component */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredArtworks.length}
            itemsPerPage={artworksPerPage}
            paginate={paginate}
          />
        </>
      ) : (
        <div className="col-span-full text-center py-16 text-gray-500  rounded-lg">
          <FaSearch className="w-16 h-16 md:w-20 md:h-20 mx-auto text-indigo-300" />
          <p className="text-lg md:text-xl font-medium">
            No artworks found matching your filters.
          </p>
          <p className="mt-2 text-sm md:text-base px-4">
            Try adjusting your search criteria or browse all categories.
          </p>
          <div
            onClick={() => {
              setFilters({ category: "", searchTerm: "" });
              setSortBy("latest");
            }}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Reset Filters
          </div>
        </div>
      )}

      {/* Bottom spacing to account for the floating filter button on mobile */}
      <div className="h-16 md:h-0"></div>
    </div>
  );
}

export default Gallery;
