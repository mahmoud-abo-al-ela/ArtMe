import React from "react";
import { FiMoreVertical } from "react-icons/fi";

const MobileUserCard = ({ user, onEdit, onDelete, isSelected, onSelect }) => {
  return (
    <div
      className={`bg-white p-3 rounded-lg shadow ${
        isSelected ? "border-2 border-primary" : "border border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {onSelect && user.role !== "admin" && (
            <input
              type="checkbox"
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
              checked={isSelected}
              onChange={onSelect}
            />
          )}
          <div className="font-medium text-sm">{user.name}</div>
        </div>
        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              const dropdown = e.currentTarget.nextElementSibling;
              dropdown.classList.toggle("hidden");

              // Close dropdown when clicking outside
              const closeDropdown = (event) => {
                if (
                  !dropdown.contains(event.target) &&
                  !e.currentTarget.contains(event.target)
                ) {
                  dropdown.classList.add("hidden");
                  document.removeEventListener("click", closeDropdown);
                }
              };

              setTimeout(() => {
                document.addEventListener("click", closeDropdown);
              }, 0);
            }}
          >
            <FiMoreVertical size={16} />
          </button>
          <div className="hidden absolute right-0 bg-white shadow-lg rounded-md mt-1 w-32 z-10">
            <button
              onClick={() => onEdit(user)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(user._id)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-600 mb-1 truncate">{user.email}</div>
      <div className="flex justify-between items-center">
        <span className="text-xs py-1 px-2 bg-gray-100 rounded-full capitalize">
          {user.role}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default MobileUserCard;
