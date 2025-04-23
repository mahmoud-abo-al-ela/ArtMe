import React from "react";
import ArtworkCard from "./ArtworkCard";
import DeleteConfirmation from "./DeleteConfirmation";

const ArtworkGrid = ({
  artworks,
  loadingImages,
  handleImageClick,
  setShowDeleteConfirm,
  showDeleteConfirm,
  handleDelete,
  deletingArtwork,
  handleImageLoad,
  handleImageError,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {artworks.map((artwork) => (
        <div key={artwork._id} className="relative">
          <ArtworkCard
            artwork={artwork}
            loadingImages={loadingImages}
            handleImageClick={handleImageClick}
            setShowDeleteConfirm={setShowDeleteConfirm}
            handleImageLoad={handleImageLoad}
            handleImageError={handleImageError}
          />
          <DeleteConfirmation
            artwork={artwork}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            handleDelete={handleDelete}
            deletingArtwork={deletingArtwork}
          />
        </div>
      ))}
    </div>
  );
};

export default ArtworkGrid;
