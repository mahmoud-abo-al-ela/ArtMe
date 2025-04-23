import React, { useState } from "react";
import LoadingScreen from "../common/LoadingScreen";
import ErrorMessage from "../common/ErrorMessage";
import EmptyState from "../common/EmptyState";
import MobileUserHeader from "./MobileUserHeader";
import MobileUserFiltersAndSort from "./MobileUserFiltersAndSort";
import MobileUserList from "./MobileUserList";
import DesktopUserTable from "./DesktopUserTable";

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
  filters,
  setFilters,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const nonAdminUsers = users.filter((user) => user.role !== "admin");
  const allSelected =
    nonAdminUsers.length > 0 && selectedUsers.length === nonAdminUsers.length;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Mobile components */}
      <div className="md:hidden">
        <MobileUserHeader
          userCount={users.length}
          nonAdminCount={nonAdminUsers.length}
          allSelected={allSelected}
          onSelectAll={onSelectAll}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
        />

        {showMobileFilters && (
          <MobileUserFiltersAndSort
            onSort={onSort}
            sortField={sortField}
            sortDirection={sortDirection}
            filters={filters}
            setFilters={setFilters}
            isFilterMenuOpen={isFilterMenuOpen}
            setIsFilterMenuOpen={setIsFilterMenuOpen}
          />
        )}

        <MobileUserList
          users={users}
          onEdit={onEdit}
          onDelete={onDelete}
          selectedUsers={selectedUsers}
          onSelectUser={onSelectUser}
        />
      </div>

      {/* Desktop components */}
      <DesktopUserTable
        users={users}
        onRoleChange={onRoleChange}
        onDelete={onDelete}
        onEdit={onEdit}
        onSort={onSort}
        sortField={sortField}
        sortDirection={sortDirection}
        selectedUsers={selectedUsers}
        onSelectUser={onSelectUser}
        onSelectAll={onSelectAll}
        allSelected={allSelected}
      />
    </div>
  );
};

export default UserList;
