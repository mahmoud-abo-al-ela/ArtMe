import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiUser, FiMail, FiInfo, FiLock } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const UserEditModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    bio: "",
    socialLinks: {
      instagram: "",
      facebook: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        bio: user.bio || "",
        socialLinks: {
          instagram: user.socialLinks?.instagram || "",
          facebook: user.socialLinks?.facebook || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = "Password is required for new users";
    } else if (!user && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      if (user) {
        await onSave({
          ...formData,
          _id: user._id,
        });
      } else {
        await onSave({
          ...formData,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      setErrors({ form: "Failed to save user. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop/overlay */}
      <div className="fixed inset-0 bg-gray-500/75" aria-hidden="true"></div>

      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative">
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-text">
              {user?._id ? "Edit User" : "Add User"}
            </h3>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {errors.form && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {errors.form}
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-text mb-1"
                htmlFor="name"
              >
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-text mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {!user && (
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-text mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-text mb-1"
                htmlFor="role"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-text mb-1"
                htmlFor="bio"
              >
                Bio
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FiInfo className="text-gray-400" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                ></textarea>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-2">
                Social Links
              </label>
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-xs text-text-light mb-1"
                    htmlFor="instagram"
                  >
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="socialLinks.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    placeholder="@username"
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-text-light mb-1"
                    htmlFor="facebook"
                  >
                    Facebook
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="socialLinks.facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleChange}
                    placeholder="username or profile URL"
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none flex items-center"
              >
                {loading ? (
                  <>
                    <span className="mr-2">Saving...</span>
                    <FaSpinner className="animate-spin" />
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
