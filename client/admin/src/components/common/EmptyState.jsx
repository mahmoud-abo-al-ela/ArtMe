import React from "react";
import { FiUsers, FiFileText, FiImage, FiSearch } from "react-icons/fi";

const icons = {
  users: FiUsers,
  files: FiFileText,
  images: FiImage,
  search: FiSearch,
};

const EmptyState = ({ title, description, icon = "search", action }) => {
  const Icon = icons[icon] || FiSearch;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg min-h-[200px] mt-2">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <Icon className="h-8 w-8 text-text-light" />
      </div>
      <h3 className="text-lg font-medium text-text mb-2">{title}</h3>
      <p className="text-text-light max-w-sm mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
