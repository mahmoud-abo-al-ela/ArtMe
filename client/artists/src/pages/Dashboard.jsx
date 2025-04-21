import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

// Import components
import FilterBar from "../components/dashboard/FilterBar";
import ArtworkGrid from "../components/dashboard/ArtworkGrid";
import EmptyState from "../components/dashboard/EmptyState";
import FullImageView from "../components/dashboard/FullImageView";
import Notification from "../components/dashboard/Notification";
import Pagination from "../components/dashboard/Pagination";
import Styles from "../components/dashboard/Styles";

function Dashboard({ user }) {
  // State
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [fullImage, setFullImage] = useState(null);
  const [loadingImages, setLoadingImages] = useState({});
  const [deletingArtwork, setDeletingArtwork] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Refs
  const statsRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  // Fetch artworks
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/artworks`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const userArtworks = res.data.filter(
          (artwork) => artwork.artist._id === user.id
        );
        setArtworks(userArtworks);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchArtworks();
  }, [user]);

  // Stats animation
  useEffect(() => {
    if (statsRef.current && !loading) {
      statsRef.current.classList.add("animate-in");
    }
  }, [loading]);

  // Handle artwork deletion
  const handleDelete = async (id) => {
    try {
      setDeletingArtwork(id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/artworks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const deletedArtwork = artworks.find((artwork) => artwork._id === id);
      const artworkTitle = deletedArtwork ? deletedArtwork.title : "Artwork";

      setArtworks(artworks.filter((artwork) => artwork._id !== id));
      setShowDeleteConfirm(null);
      setDeletingArtwork(null);

      showNotification(`"${artworkTitle}" was deleted successfully.`);
    } catch (err) {
      console.error(err);
      setDeletingArtwork(null);
      showNotification("Failed to delete artwork. Please try again.", "error");
    }
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    setNotification({ message, type });

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Clear notification timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Image modal handling
  const handleImageClick = (artwork) => {
    setFullImage(artwork);
    document.body.style.overflow = "hidden";
  };

  const closeFullImage = () => {
    setFullImage(null);
    document.body.style.overflow = "auto";
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (fullImage && e.key === "Escape") closeFullImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullImage]);

  // Initialize loading state for images
  useEffect(() => {
    if (artworks.length > 0) {
      const initialLoadingState = {};
      artworks.forEach((artwork) => {
        initialLoadingState[artwork._id] = false;
        // Get the image URL from either images array or imageUrl
        const imageUrl =
          artwork.images && artwork.images.length > 0
            ? artwork.images[0]
            : artwork.imageUrl;

        if (imageUrl) {
          const img = new Image();
          img.onload = () => {
            setLoadingImages((prev) => ({
              ...prev,
              [artwork._id]: false,
            }));
          };
          img.src = imageUrl;
          if (!img.complete) {
            initialLoadingState[artwork._id] = true;
          }
        }
      });
      setLoadingImages(initialLoadingState);
    }
  }, [artworks]);

  // Image loading handlers
  const handleImageLoad = (artworkId) => {
    setLoadingImages((prev) => ({
      ...prev,
      [artworkId]: false,
    }));
  };

  const handleImageError = (artworkId) => {
    setLoadingImages((prev) => ({
      ...prev,
      [artworkId]: false,
    }));
    console.warn(`Failed to load image for artwork ID: ${artworkId}`);
  };

  // Filter and pagination
  const filteredArtworks =
    filter === "all"
      ? artworks
      : artworks.filter((artwork) => artwork.category === filter);

  const indexOfLastArtwork = currentPage * itemsPerPage;
  const indexOfFirstArtwork = indexOfLastArtwork - itemsPerPage;
  const currentArtworks = filteredArtworks.slice(
    indexOfFirstArtwork,
    indexOfLastArtwork
  );

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Derive data for components
  const categoryCountMap = artworks.reduce((acc, artwork) => {
    const category = artwork.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categories = [...new Set(artworks.map((artwork) => artwork.category))];

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl min-h-[85vh] mx-auto p-4 sm:p-6 lg:p-8 fade-in">
      <div className="mb-8 relative">
        <h1 className="text-3xl font-bold text-gray-800 section-title after:content-[''] after:block after:w-24 after:h-1 after:bg-indigo-600 after:mt-2">
          Your Creative Journey
        </h1>
      </div>

      {/* Notification Component */}
      <Notification notification={notification} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        {/* Filter Component */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          artworks={artworks}
          categories={categories}
          categoryCountMap={categoryCountMap}
        />
      </div>

      {filteredArtworks.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div>
          {/* Artwork Grid Component */}
          <ArtworkGrid
            artworks={currentArtworks}
            loadingImages={loadingImages}
            handleImageClick={handleImageClick}
            setShowDeleteConfirm={setShowDeleteConfirm}
            showDeleteConfirm={showDeleteConfirm}
            handleDelete={handleDelete}
            deletingArtwork={deletingArtwork}
            handleImageLoad={handleImageLoad}
            handleImageError={handleImageError}
          />

          {/* Pagination Component */}
          {filteredArtworks.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={filteredArtworks.length}
              itemsPerPage={itemsPerPage}
              indexOfFirstItem={indexOfFirstArtwork}
              indexOfLastItem={indexOfLastArtwork}
            />
          )}
        </div>
      )}

      {/* Full Image View Component */}

      <FullImageView
        fullImage={fullImage}
        closeFullImage={closeFullImage}
        loadingImages={loadingImages}
        handleImageLoad={handleImageLoad}
        handleImageError={handleImageError}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />

      {/* Styles Component */}
      <Styles />
    </div>
  );
}

export default Dashboard;
