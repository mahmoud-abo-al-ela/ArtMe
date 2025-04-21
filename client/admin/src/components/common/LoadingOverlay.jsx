import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingOverlay = ({
  isLoading,
  message = "Processing...",
  children,
  blur = false,
}) => {
  return (
    <div className="relative">
      {children}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] z-10 transition-opacity duration-200">
          <div className="flex flex-col items-center p-6 bg-white/80 rounded-lg shadow-md">
            <FaSpinner className="text-primary animate-spin h-8 w-8 mb-2" />
            <p className="text-text font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
