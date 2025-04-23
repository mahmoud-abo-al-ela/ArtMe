import React from "react";
import UserTableHeader from "./UserTableHeader";
import UserTableRow from "./UserTableRow";

const DesktopUserTable = ({
  users,
  onRoleChange,
  onDelete,
  onEdit,
  onSort,
  sortField,
  sortDirection,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  allSelected,
}) => {
  return (
    <div className="hidden md:block overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <UserTableHeader
          onSelectAll={onSelectAll}
          allSelected={allSelected}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onSelectUser={onSelectUser}
          paginatedUsers={users}
          selectedUsers={selectedUsers}
        />
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <UserTableRow
              key={user._id}
              user={user}
              onRoleChange={onRoleChange}
              onDelete={onDelete}
              onEdit={onEdit}
              isSelected={selectedUsers.includes(user._id)}
              onSelect={onSelectUser ? () => onSelectUser(user._id) : undefined}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesktopUserTable;
