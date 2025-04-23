import React from "react";
import { FaTimes } from "react-icons/fa";

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div
      className={`fixed bottom-2 sm:bottom-4 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg animate-slide-up max-w-[calc(100vw-1rem)] sm:max-w-sm md:max-w-md ${
        notification.type === "error"
          ? "bg-red-100 text-red-800 border-l-4 border-red-500"
          : "bg-green-100 text-green-800 border-l-4 border-green-500"
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center">
        <div
          className={`p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${
            notification.type === "error" ? "bg-red-200" : "bg-green-200"
          }`}
        >
          {notification.type === "error" ? (
            <FaTimes className="text-red-600 text-xs sm:text-sm" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <p className="text-sm sm:text-base">{notification.message}</p>
      </div>
    </div>
  );
};

export default Notification;
