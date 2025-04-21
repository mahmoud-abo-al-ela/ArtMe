import React from "react";
import { FiLoader } from "react-icons/fi";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-40">
      <FiLoader className="animate-spin text-primary h-8 w-8 mb-3" />
      <p className="text-text-light">{message}</p>
    </div>
  );
};

export default Loading;
