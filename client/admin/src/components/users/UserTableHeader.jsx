import React from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const UserTableHeader = ({
  onSelectAll,
  allSelected,
  onSort,
  sortField,
  sortDirection,
  paginatedUsers,
  selectedUsers,
}) => {
  // Calculate if all non-admin users are selected
  const nonAdminUsers =
    paginatedUsers?.filter((user) => user.role !== "admin") || [];
  const nonAdminCount = nonAdminUsers.length;
  const selectedCount = selectedUsers?.length || 0;
  const allNonAdminSelected =
    nonAdminCount > 0 && selectedCount === nonAdminCount;

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

  const SortableHeader = ({ field, label, className = "" }) => (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 ${className}`}
      onClick={() => handleColumnClick(field)}
    >
      <div className="flex items-center">
        <span>{label}</span>
        {renderSortIcon(field)}
      </div>
    </th>
  );

  return (
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="text-start px-3 py-3">
          <input
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 rounded"
            checked={allNonAdminSelected}
            onChange={onSelectAll}
            aria-label="Select all non-admin users"
          />
        </th>
        <SortableHeader field="name" label="Name" />
        <SortableHeader field="email" label="Email" />
        <SortableHeader field="role" label="Role" />
        <SortableHeader field="createdAt" label="Created" />
        <th
          scope="col"
          className="relative px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <span>Actions</span>
        </th>
      </tr>
    </thead>
  );
};

// Export the sorting utilities for reuse in mobile view
export const SortUtils = {
  renderSortIcon: (field, sortField, sortDirection) => {
    if (sortField !== field) {
      return null;
    }
    return sortDirection === "asc" ? (
      <FiChevronUp className="inline ml-1" size={14} />
    ) : (
      <FiChevronDown className="inline ml-1" size={14} />
    );
  },

  handleColumnClick: (field, onSort) => {
    if (onSort) {
      onSort(field);
    }
  },
};

export default UserTableHeader;
