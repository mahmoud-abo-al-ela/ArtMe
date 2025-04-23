import React from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { formatDate } from "../../utils/dateUtils";

const UserTableRow = ({
  user,
  onDelete,
  onEdit,
  isSelected = false,
  onSelect,
}) => {
  return (
    <tr
      className={`${
        isSelected ? "bg-gray-50" : ""
      } hover:bg-gray-50 transition-colors`}
    >
      {onSelect && (
        <td className="px-2 sm:px-3 py-2 sm:py-4">
          {user.role !== "admin" && (
            <input
              type="checkbox"
              className="h-4 w-4 text-gray-700 border-gray-300 rounded focus:ring-gray-700"
              checked={isSelected}
              onChange={onSelect}
            />
          )}
        </td>
      )}
      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
        <div className="flex items-center">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full mr-1 sm:mr-2 object-cover"
            />
          ) : (
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-1 sm:mr-2 text-xs sm:text-sm">
              {user.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="truncate max-w-[100px] sm:max-w-full">
            <span className="font-medium block capitalize">{user.name}</span>
          </div>
        </div>
      </td>
      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
        <div className="truncate max-w-[100px] sm:max-w-full">{user.email}</div>
      </td>
      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm capitalize">
        {user.role}
      </td>
      <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="cursor-pointer p-1 sm:p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            title="Edit user"
            aria-label="Edit user"
          >
            <FiEdit size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete(user._id)}
            className="cursor-pointer p-1 sm:p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
            title="Delete user"
            aria-label="Delete user"
          >
            <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
