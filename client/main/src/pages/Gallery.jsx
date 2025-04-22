import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaFilter, FaSort, FaChevronDown } from "react-icons/fa";
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
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage] = useState(9);
  const [sortBy, setSortBy] = useState("latest");
  const [loadingImages, setLoadingImages] = useState({});
  const [fullImage, setFullImage] = useState(null);

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

  const handleCategoryChange = (e) => {
    setFilters({
      ...filters,
      category: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      searchTerm: e.target.value,
    });
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

  // Get current artworks for pagination
  const indexOfLastArtwork = currentPage * artworksPerPage;
  const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
  const currentArtworks = filteredArtworks.slice(
    indexOfFirstArtwork,
    indexOfLastArtwork
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-15">
        <div className="text-center max-w-3xl mx-auto mb-5">
          <h1 className="text-4xl text-black font-display font-semibold mb-4">
            Artwork Gallery
          </h1>
          <p className="text-gray-500">
            Explore our curated collection of exceptional artwork from talented
            artists around the world.
          </p>
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
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-15">
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
        <h1 className="text-4xl text-black font-display font-semibold mb-4">
          Artwork Gallery
        </h1>
        <p className="text-gray-500">
          Explore our curated collection of exceptional artwork from talented
          artists around the world.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              value={filters.searchTerm}
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
              className="w-full text-gray-500 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              value={filters.category}
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Sort by Latest</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {filteredArtworks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="col-span-full text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
          <FaSearch className="w-20 h-20 mx-auto text-indigo-300" />
          <p className="text-xl font-medium">
            No artworks found matching your filters.
          </p>
          <p className="mt-2">
            Try adjusting your search criteria or browse all categories.
          </p>
          <button
            onClick={() => setFilters({ category: "", searchTerm: "" })}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Gallery;
