import { FaSpinner } from "react-icons/fa";

function FormButtons({ uploading, onCancel, isEdit }) {
  return (
    <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
      {!uploading && (
        <button
          type="button"
          onClick={onCancel}
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
        ) : isEdit ? (
          "Update Artwork"
        ) : (
          "Add Artwork"
        )}
      </button>
    </div>
  );
}

export default FormButtons;
