import {
  FiUser,
  FiMail,
  FiInfo,
  FiInstagram,
  FiFacebook,
} from "react-icons/fi";

function ProfileForm({ formData, handleChange, isReadOnly = false }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name <span className="text-red-500">*</span>
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
            className="w-full pl-10 bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-3 py-2 sm:px-4 sm:py-3 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-gray-400" />
          </div>
          <input
            type="email"
            value={formData.email}
            className="w-full pl-10 bg-gray-200 text-gray-500 border-gray-300 rounded-lg shadow-sm px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
            disabled
            readOnly
          />
        </div>
        {!isReadOnly && (
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        )}
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Bio <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about yourself and your art..."
          className="w-full bg-gray-100 text-black placeholder:text-gray-500 px-3 py-2 sm:px-4 sm:py-3 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm sm:text-base"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>

      <div className="border-t border-gray-200 pt-4 sm:pt-5 mt-4 sm:mt-5">
        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
          <FiInstagram className="mr-2" /> Social Links{" "}
          <span className="text-gray-500 text-xs sm:text-sm ml-2">
            (optional)
          </span>
        </h3>

        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiInstagram className="text-gray-400" />
            </div>
            <input
              type="url"
              name="social.instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              className="w-full pl-10 bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-3 py-2 sm:px-4 sm:py-3 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
              placeholder="https://instagram.com/yourusername"
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFacebook className="text-gray-400" />
            </div>
            <input
              type="url"
              name="social.facebook"
              value={formData.socialLinks.facebook}
              onChange={handleChange}
              className="w-full pl-10 bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-3 py-2 sm:px-4 sm:py-3 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
              placeholder="https://facebook.com/yourusername"
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;
