import React from "react";
import { FiAlertTriangle, FiX, FiLoader } from "react-icons/fi";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // danger, warning, info
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const typeClasses = {
    danger: {
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      bg: "bg-red-50",
    },
    warning: {
      icon: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      bg: "bg-yellow-50",
    },
    info: {
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      bg: "bg-blue-50",
    },
  };

  const classes = typeClasses[type] || typeClasses.danger;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-xl">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-full ${classes.bg} mr-3`}>
                <FiAlertTriangle className={`h-6 w-6 ${classes.icon}`} />
              </div>
              <h3 className="text-lg font-medium text-text">{title}</h3>
            </div>

            <div className="mt-2">
              <p className="text-sm text-text-light">{message}</p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${classes.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 flex items-center`}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
