import React, { useState } from "react";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const MobileUserList = ({
  users,
  onEdit,
  onDelete,
  selectedUsers,
  onSelectUser,
}) => {
  const [expandedCard, setExpandedCard] = useState(null);

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return new Date(dateString).toLocaleDateString();
    }
  };

  // Handles card expansion for better touch interaction on mobile
  const toggleCardExpand = (userId) => {
    setExpandedCard(expandedCard === userId ? null : userId);
  };

  // Renders a single user card with dropdown menu
  const UserCard = ({ user, isSelected }) => (
    <div
      className={`bg-white rounded-lg shadow-sm mb-3 overflow-hidden transition-all duration-300 ${
        isSelected
          ? "border-l-4 border-blue-500 ring-1 ring-blue-500 ring-opacity-20"
          : "border border-gray-200"
      } ${expandedCard === user._id ? "scale-[1.02]" : ""}`}
    >
      {/* Card Header */}
      <div
        className="flex justify-between items-center p-3 border-b border-gray-100 cursor-pointer"
        onClick={() => toggleCardExpand(user._id)}
      >
        <div className="flex items-center">
          {onSelectUser && user.role !== "admin" && (
            <div
              className="mr-3"
              onClick={(e) => {
                e.stopPropagation();
                onSelectUser(user._id);
              }}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center rounded-full border transition-colors ${
                  isSelected
                    ? "bg-blue-500 border-gray-300 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isSelected && <FiCheck size={12} />}
              </div>
            </div>
          )}

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-2">
              {user.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div className="font-medium text-sm">{user.name}</div>
              <div className="text-xs text-gray-500 truncate max-w-[170px]">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <span
            className={`text-xs py-1 px-2 rounded-full capitalize mr-2 ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {user.role}
          </span>
          <button
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              toggleCardExpand(user._id);
            }}
          >
            {expandedCard === user._id ? (
              <FiX size={18} />
            ) : (
              <FiMoreVertical size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Card Content */}
      {expandedCard === user._id && (
        <div className="p-3 bg-gray-50 animate-fadeIn">
          <div className="text-xs text-gray-500 mb-3">
            Created {formatRelativeDate(user.createdAt)}
          </div>

          {user.role !== "admin" && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(user)}
                className="flex-1 flex items-center justify-center py-2 px-3 bg-white hover:bg-gray-50 text-gray-700 rounded-md border border-gray-200 text-sm transition-colors"
              >
                <FiEdit2 size={14} className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => onDelete(user._id)}
                className="flex-1 flex items-center justify-center py-2 px-3 bg-white hover:bg-red-50 text-red-600 rounded-md border border-gray-200 text-sm transition-colors"
              >
                <FiTrash2 size={14} className="mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-3 md:hidden">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          isSelected={selectedUsers.includes(user._id)}
        />
      ))}
    </div>
  );
};

export default MobileUserList;
