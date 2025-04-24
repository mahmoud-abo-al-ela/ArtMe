import { useState } from "react";
import { FaImages } from "react-icons/fa";

function ImageUploader({ previewUrl, onImageChange, isRequired, isMobile }) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onImageChange(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
    }
  };

  const inputId = isMobile ? "image-upload" : "image-upload-desktop";
  const maxHeight = isMobile ? "max-h-48" : "max-h-64";
  const paddingClasses = isMobile ? "px-4 pt-6 pb-6" : "px-6 pt-8 pb-8";
  const iconSize = isMobile ? "h-12 w-12" : "h-16 w-16";
  const textSize = isMobile ? "text-sm" : "text-base";
  const buttonPadding = isMobile ? "px-4 py-2" : "px-5 py-2.5";
  const uploadText = isMobile
    ? "Tap to upload image"
    : "Drag and drop your image here, or click to browse";
  const spaceY = isMobile ? "space-y-2" : "space-y-3";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Artwork Image {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" onDragOver={handleDragOver} onDrop={handleDrop}>
        {previewUrl ? (
          <div className="mb-4 relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className={`w-full h-auto rounded-lg shadow-sm object-contain ${maxHeight}`}
            />
            <div className="absolute inset-0 bg-[#23232e6f] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
              <div
                type="button"
                onClick={() => document.getElementById(inputId).click()}
                className={`cursor-pointer bg-white text-gray-800 ${buttonPadding} rounded-md text-sm font-medium hover:bg-gray-100 shadow-lg`}
              >
                Change Image
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`mt-1 flex justify-center ${paddingClasses} border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
            onClick={() => document.getElementById(inputId).click()}
          >
            <div className={`${spaceY} text-center`}>
              <FaImages className={`mx-auto ${iconSize} text-gray-400`} />
              <div>
                <p className={`${textSize} text-gray-600`}>{uploadText}</p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        )}
        <input
          type="file"
          id={inputId}
          name="image"
          accept="image/*"
          onChange={handleFileInputChange}
          required={isRequired && !previewUrl}
          className="sr-only"
        />
      </div>
    </div>
  );
}

export default ImageUploader;
