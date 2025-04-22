import React from "react";
import UserTableRow from "./UserTableRow";
import LoadingScreen from "../dashboard/LoadingScreen";
import ErrorMessage from "../common/ErrorMessage";
import EmptyState from "../common/EmptyState";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const UserList = ({
  users,
  loading,
  error,
  onRoleChange,
  onDelete,
  onEdit,
  onSort,
  sortField,
  sortDirection,
  selectedUsers = [],
  onSelectUser,
  onSelectAll,
}) => {
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!users || users.length === 0) {
    return (
      <EmptyState
        title="No users found"
        description="There are no users matching your search criteria."
        icon="users"
      />
    );
  }

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return null;
    }
    return sortDirection === "asc" ? (
      <FiChevronUp className="inline ml-1" size={14} />
    ) : (
      <FiChevronDown className="inline ml-1" size={14} />
    );
  };

  const handleColumnClick = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const allSelected = users.length > 0 && selectedUsers.length === users.length;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {onSelectUser && onSelectAll && (
                <th className="px-3 py-3 w-10">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      checked={allSelected}
                      onChange={onSelectAll}
                    />
                  </div>
                </th>
              )}
              <th
                className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleColumnClick("name")}
              >
                <span className="flex items-center">
                  Name {renderSortIcon("name")}
                </span>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleColumnClick("email")}
              >
                <span className="flex items-center">
                  Email {renderSortIcon("email")}
                </span>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleColumnClick("role")}
              >
                <span className="flex items-center">
                  Role {renderSortIcon("role")}
                </span>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleColumnClick("createdAt")}
              >
                <span className="flex items-center">
                  Created {renderSortIcon("createdAt")}
                </span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <UserTableRow
                key={user._id}
                user={user}
                onRoleChange={onRoleChange}
                onDelete={onDelete}
                onEdit={onEdit}
                isSelected={selectedUsers.includes(user._id)}
                onSelect={
                  onSelectUser ? () => onSelectUser(user._id) : undefined
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
