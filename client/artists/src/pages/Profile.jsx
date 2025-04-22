import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProfileView from "../components/profile/ProfileView";
import ProfileEditForm from "../components/profile/ProfileEditForm";

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    socialLinks: {
      instagram: "",
      facebook: "",
    },
  });

  useEffect(() => {
    let isMounted = true; // Track component mount state
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/artists/profile`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (isMounted) {
          setProfile(res.data);
          setPreviewUrl(res.data.profileImage);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            bio: res.data.bio || "",
            socialLinks: {
              instagram: res.data.social?.instagram || "",
              facebook: res.data.social?.facebook || "",
            },
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          toast.error("Failed to load profile data");
          setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [user]);

  const validateUrl = (url) => {
    if (!url) return true; // Allow empty URLs
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormTouched(true);
    if (name.startsWith("social.")) {
      const socialNetwork = name.split(".")[1];
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialNetwork]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate URLs
    const { socialLinks } = formData;
    if (
      !Object.values(socialLinks).every((link) => !link || validateUrl(link))
    ) {
      toast.error("Invalid social media URL");
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = {
        name: formData.name,
        bio: formData.bio,
        social: formData.socialLinks,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/artists/profile`,
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          timeout: 10000, // 10 seconds timeout
        }
      );
      setProfile(res.data);

      // Handle image upload if there is a new image
      if (image) {
        await handleProfileImageUpload(image);
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      setFormTouched(false);
    } catch (err) {
      console.error("Profile update error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (err.code === "ECONNABORTED") {
        toast.error("Request timed out. Please try again later.");
      } else {
        toast.error(
          err.response?.data?.message ||
            "Failed to update profile. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (image) => {
    setUploading(true);
    try {
      console.log("Uploading image:", {
        name: image.name,
        type: image.type,
        size: image.size,
      });
      const uploadFormData = new FormData();
      uploadFormData.append("profileImage", image); // image is a File object

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/artists/profile/image`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      setProfile({
        ...profile,
        profileImage: res.data.profileImage,
      });
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const clearMessages = () => {
    toast.dismiss();
  };

  const confirmCancel = () => {
    if (formTouched && !window.confirm("Discard your changes?")) {
      return;
    }
    setIsEditing(false);
    clearMessages();
    setPreviewUrl(profile?.profileImage || null);
    setFormTouched(false);
  };

  if (loading && !profile && !previewUrl) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-32 w-32 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2.5"></div>
          <div className="h-3 bg-gray-200 rounded w-40 mb-6"></div>
          <div className="h-2 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Artist Profile</h1>
      </div>

      {!isEditing ? (
        <ProfileView profile={profile} onEditClick={() => setIsEditing(true)} />
      ) : (
        <ProfileEditForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          confirmCancel={confirmCancel}
          loading={loading}
          uploading={uploading}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          image={image}
          setImage={setImage}
          profile={profile}
          setFormTouched={setFormTouched}
        />
      )}
    </div>
  );
}

export default Profile;
