import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "medium" }) => {
  // Size mapping
  const sizeMap = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-20 h-20",
    xlarge: "w-32 h-32",
  };

  const sizeClass = sizeMap[size] || sizeMap.medium;

  return (
    <div className={`loading-spinner-container ${sizeClass}`}>
      <svg
        viewBox="0 0 24 24"
        className="loading-spinner-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pulsing outer circle */}
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="circle-path"
        />

        {/* Left eye that blinks */}
        <path
          d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z"
          fill="currentColor"
          className="eye-left"
        />

        {/* Right eye that blinks */}
        <path
          d="M16 9C16.5523 9 17 8.55228 17 8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8C15 8.55228 15.4477 9 16 9Z"
          fill="currentColor"
          className="eye-right"
        />

        {/* Smiling mouth that changes */}
        <path
          d="M15 13H9C9 14.6569 10.3431 16 12 16C13.6569 16 15 14.6569 15 13Z"
          fill="currentColor"
          className="smile"
        />
      </svg>

      {/* Rotating rings around the spinner */}
      <div className="spinner-ring ring-1"></div>
    </div>
  );
};

export default LoadingSpinner;
