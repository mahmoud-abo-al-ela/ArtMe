import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner, FaImages } from "react-icons/fa";
import toast from "react-hot-toast";

function ArtworkForm({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    isForSale: false,
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const categories = [
    "Painting",
    "Drawing",
    "Sculpture",
    "Photography",
    "Digital Art",
    "Mixed Media",
    "Installation",
    "Printmaking",
    "Textile",
    "Ceramics",
    "Other",
  ];

  useEffect(() => {
    const fetchArtwork = async () => {
      if (id) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/artworks/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          const artwork = res.data;

          // Check if the artwork belongs to the logged in user
          if (artwork.artist._id !== user.id) {
            setError("You do not have permission to edit this artwork.");
            setLoading(false);
            return;
          }

          setFormData({
            title: artwork.title,
            category: artwork.category,
            description: artwork.description || "",
            price: artwork.price || "",
            isForSale: artwork.isForSale || false,
          });
          setPreviewUrl(artwork.imageUrl);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Failed to load artwork.");
          setLoading(false);
        }
      }
    };
    fetchArtwork();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setFormTouched(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setFormTouched(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setFormTouched(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("isForSale", String(formData.isForSale));
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      if (formData.isForSale && formData.price) {
        formDataToSend.append("price", parseFloat(formData.price));
      }
      if (image) {
        formDataToSend.append("image", image);
      }
      // Add artist ID explicitly
      formDataToSend.append("artist", user.id);

      let response;
      if (id) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/artworks/${id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/artworks`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setUploading(false);
      navigate("/dashboard");
      if (id) {
        toast.success("Artwork updated successfully");
      } else {
        toast.success("Artwork added successfully");
      }
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save artwork. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setUploading(false);
    }
  };

  const confirmCancel = () => {
    if (!formTouched || window.confirm("Discard your changes?")) {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-md bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl text-red-700 font-medium mb-3">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 mt-10">
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl sm:text-3xl font-bold text-gray-800">
          {id ? "Edit Artwork" : "Add New Artwork"}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Artwork Details
          </h2>

          {/* Mobile - single column layout */}
          <div className="flex flex-col md:hidden gap-6">
            {/* Image upload section - Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artwork Image {!id && <span className="text-red-500">*</span>}
              </label>
              <div
                className="relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="mb-4 relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto rounded-lg shadow-sm object-contain max-h-48"
                    />
                    <div className="absolute inset-0 bg-[#23232e6f] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                      <div
                        type="button"
                        onClick={() =>
                          document.getElementById("image-upload").click()
                        }
                        className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 shadow-lg"
                      >
                        Change Image
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="mt-1 flex justify-center px-4 pt-6 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() =>
                      document.getElementById("image-upload").click()
                    }
                  >
                    <div className="space-y-2 text-center">
                      <FaImages className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Tap to upload image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="image-upload"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!id && !previewUrl}
                  className="sr-only"
                />
              </div>
            </div>

            {/* Form fields - Mobile */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter artwork title"
                  className="w-full bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-4 py-2.5 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-4 py-2.5 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description-mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  id="description-mobile"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe your artwork"
                  className="w-full bg-gray-100 text-black placeholder:text-gray-500 px-4 py-2.5 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="isForSale-mobile"
                        name="isForSale"
                        checked={formData.isForSale}
                        onChange={handleChange}
                        className="h-5 w-5 outline-none border-2 border-gray-300 rounded appearance-none checked:bg-indigo-600 bg-white"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="isForSale-mobile"
                        className="font-medium text-gray-700"
                      >
                        This artwork is for sale
                      </label>
                    </div>
                  </div>
                </div>

                {formData.isForSale && (
                  <div className="border-t border-gray-200 pt-4 animate-fadein">
                    <label
                      htmlFor="price-mobile"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="price-mobile"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required={formData.isForSale}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full pl-4 bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-4 py-2.5 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">EGP</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tablet and Desktop - two column layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-8">
            {/* Image upload section - Desktop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artwork Image {!id && <span className="text-red-500">*</span>}
              </label>
              <div
                className="relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="mb-4 relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto rounded-lg shadow-sm object-contain max-h-64"
                    />
                    <div className="absolute inset-0 bg-[#23232e6f] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                      <div
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("image-upload-desktop")
                            .click()
                        }
                        className="cursor-pointer bg-white text-gray-800 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-100 shadow-lg"
                      >
                        Change Image
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() =>
                      document.getElementById("image-upload-desktop").click()
                    }
                  >
                    <div className="space-y-3 text-center">
                      <FaImages className="mx-auto h-16 w-16 text-gray-400" />
                      <div>
                        <p className="text-base text-gray-600">
                          Drag and drop your image here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="image-upload-desktop"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!id && !previewUrl}
                  className="sr-only"
                />
              </div>
            </div>

            {/* Form fields - Desktop */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title-desktop"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title-desktop"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter artwork title"
                  className="w-full bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-4 py-3 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="category-desktop"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category-desktop"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-4 py-3 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description-desktop"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  id="description-desktop"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your artwork (media, inspiration, context...)"
                  className="w-full bg-gray-100 text-black placeholder:text-gray-500 px-4 py-3 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="isForSale-desktop"
                        name="isForSale"
                        checked={formData.isForSale}
                        onChange={handleChange}
                        className="h-5 w-5 outline-none border-2 border-gray-300 rounded appearance-none checked:bg-indigo-600 bg-white"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="isForSale-desktop"
                        className="font-medium text-gray-700"
                      >
                        This artwork is for sale
                      </label>
                    </div>
                  </div>
                </div>

                {formData.isForSale && (
                  <div className="border-t border-gray-200 pt-4 animate-fadein">
                    <label
                      htmlFor="price-desktop"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="price-desktop"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required={formData.isForSale}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full pl-4 bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-4 py-3 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">EGP</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
          {!uploading && (
            <button
              type="button"
              onClick={confirmCancel}
              className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={uploading}
            className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 font-medium flex items-center justify-center min-w-[120px] transition-colors"
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Saving...
              </>
            ) : id ? (
              "Update Artwork"
            ) : (
              "Add Artwork"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArtworkForm;
