import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../utils/api";
import { FiRefreshCw } from "react-icons/fi";

// Import common components
import LoadingScreen from "../components/dashboard/LoadingScreen";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";

// Import artwork components
import ArtworkCard from "../components/artworks/ArtworkCard";
import ArtworksFilters from "../components/artworks/ArtworksFilters";
import BulkActionsBar from "../components/artworks/BulkActionsBar";
import ArtworkDetailsModal from "../components/artworks/ArtworkDetailsModal";

const Artworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    category: "all",
    sortBy: "newest",
  });
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Add refs for focus management
  const searchInputRef = useRef(null);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      // Just fetch all artworks without filtering
      const response = await api.get("/artworks");
      let data = response.data;

      setArtworks(data);

      // Initially set filtered artworks to all artworks
      setFilteredArtworks(data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(data.map((artwork) => artwork.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      setError("Failed to fetch artworks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch artworks on component mount, not when filters change
  useEffect(() => {
    fetchArtworks();
  }, []);

  // Add client-side filtering
  useEffect(() => {
    if (!artworks.length) return;

    let results = [...artworks];

    // Apply category filter
    if (filterOptions.category !== "all") {
      results = results.filter(
        (artwork) => artwork.category === filterOptions.category
      );
    }

    // Apply sorting
    if (filterOptions.sortBy === "newest") {
      results.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    } else if (filterOptions.sortBy === "oldest") {
      results.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
    } else if (filterOptions.sortBy === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filterOptions.sortBy === "artist") {
      results.sort((a, b) => {
        const artistA = a.artist && a.artist.name ? a.artist.name : "";
        const artistB = b.artist && b.artist.name ? b.artist.name : "";
        return artistA.localeCompare(artistB);
      });
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchLower) ||
          (artwork.artist &&
            artwork.artist.name &&
            artwork.artist.name.toLowerCase().includes(searchLower)) ||
          (artwork.description &&
            artwork.description.toLowerCase().includes(searchLower))
      );
    }

    setFilteredArtworks(results);
  }, [artworks, filterOptions, searchTerm]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilterOptions((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const resetFilters = () => {
    setFilterOptions({
      category: "all",
      sortBy: "newest",
    });

    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    setSearchTerm("");
  };

  const handleDeleteClick = (artwork) => {
    setSelectedArtwork(artwork);
    setShowDeleteModal(true);
  };

  const handleViewClick = (artwork) => {
    setSelectedArtwork(artwork);
    setShowViewModal(true);
  };

  const deleteArtwork = async () => {
    if (!selectedArtwork) return;

    setIsDeleting(true);
    try {
      await api.delete(`/artworks/${selectedArtwork._id}`);
      setArtworks((prev) => prev.filter((a) => a._id !== selectedArtwork._id));
      setFilteredArtworks((prev) =>
        prev.filter((a) => a._id !== selectedArtwork._id)
      );
      setShowDeleteModal(false);
      showNotification(
        `Artwork "${selectedArtwork.title}" was deleted successfully.`
      );
    } catch (err) {
      showNotification(
        `Failed to delete artwork: ${
          err.response?.data?.message || err.message
        }`,
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      // Clear selections when exiting select mode
      setSelectedArtworks([]);
    }
  };

  const toggleSelectArtwork = (artworkId) => {
    setSelectedArtworks((prev) => {
      if (prev.includes(artworkId)) {
        return prev.filter((id) => id !== artworkId);
      } else {
        return [...prev, artworkId];
      }
    });
  };

  const selectAll = () => {
    if (selectedArtworks.length === filteredArtworks.length) {
      // If all are selected, deselect all
      setSelectedArtworks([]);
    } else {
      // Otherwise select all
      setSelectedArtworks(filteredArtworks.map((artwork) => artwork._id));
    }
  };

  const bulkDeleteArtworks = async () => {
    setIsDeleting(true);
    try {
      // Use Promise.all for parallel requests
      // Use Promise.all for parallel requests
      const deletePromises = selectedArtworks.map((id) => {
        return api.delete(`/artworks/${id}`);
      });

      const results = await Promise.all(deletePromises);

      setArtworks((prev) =>
        prev.filter((a) => !selectedArtworks.includes(a._id))
      );
      setFilteredArtworks((prev) =>
        prev.filter((a) => !selectedArtworks.includes(a._id))
      );
      showNotification(
        `${selectedArtworks.length} artworks deleted successfully.`
      );
      setShowBulkDeleteModal(false);
      setSelectedArtworks([]);
      setSelectMode(false);
    } catch (err) {
      showNotification(
        `Failed to delete artworks: ${
          err.response?.data?.message || err.message
        }`,
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-danger rounded-md">{error}</div>;
  }

  return (
    <div>
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-light">
          Artworks Management
        </h2>
      </div>

      {/* Search and Filter Bar */}
      <ArtworksFilters
        searchInputRef={searchInputRef}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        filterOptions={filterOptions}
        handleFilterChange={handleFilterChange}
        handleSearchChange={handleSearchChange}
        resetFilters={resetFilters}
        categories={categories}
      />

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectMode={selectMode}
        selectedArtworks={selectedArtworks}
        filteredArtworks={filteredArtworks}
        selectAll={selectAll}
        setShowBulkDeleteModal={setShowBulkDeleteModal}
        toggleSelectMode={toggleSelectMode}
      />

      <div className="flex items-center mb-2">
        <button
          onClick={toggleSelectMode}
          className={`cursor-pointer flex items-center px-3 py-2 rounded mr-2 ${
            selectMode
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <span>{selectMode ? "Cancel Selection" : "Select Multiple"}</span>
        </button>
      </div>

      {filteredArtworks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork._id}
              artwork={artwork}
              onView={handleViewClick}
              onDelete={handleDeleteClick}
              isSelected={selectedArtworks.includes(artwork._id)}
              onToggleSelect={toggleSelectArtwork}
              selectMode={selectMode}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No artworks found"
          description="Try adjusting your search or filter criteria"
          icon="images"
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteArtwork}
        title="Delete Artwork"
        message={`Are you sure you want to delete "${selectedArtwork?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={isDeleting}
      />

      {/* View Artwork Modal */}
      {showViewModal && (
        <ArtworkDetailsModal
          artwork={selectedArtwork}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={bulkDeleteArtworks}
        title="Delete Multiple Artworks"
        message={`Are you sure you want to delete ${selectedArtworks.length} artworks? This action cannot be undone.`}
        confirmText="Delete All Selected"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Artworks;
