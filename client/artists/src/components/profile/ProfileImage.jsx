import { useState } from "react";
import { FaImages, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

function ProfileImage({
  previewUrl,
  setPreviewUrl,
  setImage,
  setFormTouched,
  profile,
  isEditing,
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isPreviewLoading, setIsPreviewLoading] = useState(
    previewUrl ? true : false
  );

  // Validate image file
  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, or GIF images are allowed");
      return false;
    }
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return false;
    }
    return true;
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      setImage(file);
      const reader = new FileReader();
      setIsPreviewLoading(true); // Set loading to true when starting to load new image
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setFormTouched(true);
    }
  };

  // Handle drag-and-drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && validateImage(file)) {
      setImage(file);
      const reader = new FileReader();
      setIsPreviewLoading(true); // Set loading to true when starting to load new image
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setFormTouched(true);
    }
  };

  // Image load handlers
  const handleImageLoaded = () => {
    setIsImageLoading(false);
  };

  const handlePreviewLoaded = () => {
    setIsPreviewLoading(false);
  };

  // View mode
  if (!isEditing) {
    return (
      <div className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md relative">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <FaSpinner className="animate-spin text-indigo-600 h-6 w-6 sm:h-8 sm:w-8" />
          </div>
        )}
        <img
          src={
            profile?.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile?.name || "Artist"
            )}&background=8B5CF6&color=fff&size=200`
          }
          alt={profile?.name}
          loading="lazy"
          onLoad={handleImageLoaded}
          className={`h-full w-full object-cover ${
            isImageLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
        />
      </div>
    );
  }

  // Edit mode
  return (
    <>
      <div className="relative" onDragOver={handleDragOver} onDrop={handleDrop}>
        {previewUrl ? (
          <div className="mb-2 sm:mb-4 relative group">
            <div className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md relative">
              {isPreviewLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <FaSpinner className="animate-spin text-indigo-600 h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              )}
              <img
                src={previewUrl}
                alt="Profile"
                className={`h-full w-full object-cover ${
                  isPreviewLoading ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
                loading="lazy"
                onLoad={handlePreviewLoaded}
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
              <div
                onClick={() =>
                  document.getElementById("profile-image-upload").click()
                }
                className="cursor-pointer bg-white text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-100 shadow-lg"
              >
                Change Image
              </div>
            </div>
          </div>
        ) : (
          <div
            className="mt-1 flex justify-center px-4 py-6 sm:px-6 sm:pt-8 sm:pb-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={() =>
              document.getElementById("profile-image-upload").click()
            }
          >
            <div className="space-y-2 sm:space-y-3 text-center">
              <FaImages className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
              <div>
                <p className="text-sm sm:text-base text-gray-600">
                  Drag and drop your image here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>
        )}
        <input
          type="file"
          id="profile-image-upload"
          name="profileImage"
          accept="image/png,image/jpeg,image/gif"
          onChange={handleImageChange}
          className="sr-only"
        />
      </div>
    </>
  );
}

export default ProfileImage;
