import React from "react";
import { FiAlertCircle } from "react-icons/fi";

const ErrorMessage = ({ message = "An error occurred" }) => {
  return (
    <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-md">
      <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
