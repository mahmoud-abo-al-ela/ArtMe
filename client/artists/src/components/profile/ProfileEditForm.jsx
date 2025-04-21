import { FaSpinner } from "react-icons/fa";
import ProfileImage from "./ProfileImage";
import ProfileForm from "./ProfileForm";

function ProfileEditForm({
  formData,
  handleChange,
  handleSubmit,
  confirmCancel,
  loading,
  uploading,
  previewUrl,
  setPreviewUrl,
  image,
  setImage,
  profile,
  setFormTouched,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6 sm:p-8 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image upload section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <ProfileImage
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              image={image}
              setImage={setImage}
              setFormTouched={setFormTouched}
              profile={profile}
              isEditing={true}
            />
          </div>

          {/* Form fields */}
          <div className="md:col-span-2">
            <ProfileForm formData={formData} handleChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:py-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={confirmCancel}
          className="px-5 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-400 hover:bg-gray-100 transition-colors"
          disabled={loading || uploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 font-medium flex items-center justify-center min-w-[120px] transition-colors"
        >
          {loading || uploading ? (
            <>
              <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </form>
  );
}

export default ProfileEditForm;
