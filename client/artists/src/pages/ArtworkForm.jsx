import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ImageUploader from "../components/artwork/ImageUploader";
import ArtworkDetails from "../components/artwork/ArtworkDetails";
import FormButtons from "../components/artwork/FormButtons";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

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

  const handleImageChange = (file) => {
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
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onBack={() => navigate("/dashboard")} />;
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
            <ImageUploader
              previewUrl={previewUrl}
              onImageChange={handleImageChange}
              isRequired={!id}
              isMobile={true}
            />

            <ArtworkDetails
              formData={formData}
              handleChange={handleChange}
              categories={categories}
              isMobile={true}
            />
          </div>

          {/* Tablet and Desktop - two column layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-8">
            <ImageUploader
              previewUrl={previewUrl}
              onImageChange={handleImageChange}
              isRequired={!id}
              isMobile={false}
            />

            <div>
              <ArtworkDetails
                formData={formData}
                handleChange={handleChange}
                categories={categories}
                isMobile={false}
              />
            </div>
          </div>
        </div>

        <FormButtons
          uploading={uploading}
          onCancel={confirmCancel}
          isEdit={!!id}
        />
      </form>
    </div>
  );
}

export default ArtworkForm;
