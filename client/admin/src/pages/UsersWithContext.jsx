import React, { useState } from "react";
import UserList from "../components/users/UserList";
import UserEditModal from "../components/users/UserEditModal";
import UserDeleteConfirmation from "../components/users/UserDeleteConfirmation";
import LoadingOverlay from "../components/common/LoadingOverlay";
import UserHeader from "../components/users/UserHeader";
import UserSearch from "../components/users/UserSearch";
import SearchResults from "../components/users/SearchResults";
import BulkActionsBar from "../components/users/BulkActionsBar";
import Pagination from "../components/users/Pagination";
import { useUsers } from "../context/UserContext";

const UsersWithContext = () => {
  const {
    paginatedUsers,
    loading,
    error,
    refreshing,
    actionInProgress,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    selectedUsers,
    totalPages,
    currentPage,
    indexOfFirstUser,
    indexOfLastUser,
    filteredUsers,
    isFilterMenuOpen,
    setIsFilterMenuOpen,
    fetchUsers,
    handleRoleChange,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    exportUsers,
    handleSortChange,
    handleSelectUser,
    handleSelectAllUsers,
    paginate,
    sortField,
    sortDirection,
  } = useUsers();

  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Focus on first result if any
    if (filteredUsers.length > 0) {
      const firstResultRow = document.querySelector("tbody tr");
      if (firstResultRow) {
        firstResultRow.focus();
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    // Focus back on search input
    document.getElementById("user-search-input").focus();
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    const success = await updateUser(userData);
    if (success) {
      closeEditModal();
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditUser(null);
  };

  const handleDeleteUser = (userId) => {
    const user = filteredUsers.find((u) => u._id === userId);
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    const success = await deleteUser(userToDelete._id);
    if (success) {
      closeDeleteModal();
    }
  };

  const handleBulkDelete = () => {
    if (!selectedUsers.length) return;

    // Find the first selected user to show in confirmation
    const firstUser = filteredUsers.find(
      (user) => user._id === selectedUsers[0]
    );
    const otherCount = selectedUsers.length - 1;

    setUserToDelete({
      _id: selectedUsers,
      name: `${firstUser?.name || "user"}${
        otherCount ? ` and ${otherCount} other users` : ""
      }`,
    });
    setIsDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!userToDelete?._id || !Array.isArray(userToDelete._id)) return;

    const success = await bulkDeleteUsers(userToDelete._id);
    if (success) {
      closeDeleteModal();
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleAddUser = () => {
    setEditUser(null); // No existing user, creating new
    setIsEditModalOpen(true);
  };

  return (
    <LoadingOverlay isLoading={actionInProgress} message="Processing action...">
      <div>
        <UserHeader
          fetchUsers={fetchUsers}
          loading={loading}
          refreshing={refreshing}
          exportUsers={exportUsers}
          handleAddUser={handleAddUser}
          filters={filters}
          setFilters={setFilters}
          isFilterMenuOpen={isFilterMenuOpen}
          setIsFilterMenuOpen={setIsFilterMenuOpen}
        />

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <UserSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            handleClearSearch={handleClearSearch}
          />

          <SearchResults
            searchQuery={searchQuery}
            filteredUsers={filteredUsers}
          />

          <BulkActionsBar
            selectedUsers={selectedUsers}
            handleBulkDelete={handleBulkDelete}
          />

          <UserList
            users={paginatedUsers}
            loading={loading}
            error={error}
            onRoleChange={handleRoleChange}
            onDelete={handleDeleteUser}
            onEdit={handleEditUser}
            onSort={handleSortChange}
            sortField={sortField}
            sortDirection={sortDirection}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAllUsers}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            indexOfFirstUser={indexOfFirstUser}
            indexOfLastUser={indexOfLastUser}
            filteredUsersLength={filteredUsers.length}
          />
        </div>

        {isEditModalOpen && (
          <UserEditModal
            user={editUser}
            onClose={closeEditModal}
            onSave={handleSaveUser}
          />
        )}

        <UserDeleteConfirmation
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={
            Array.isArray(userToDelete?._id)
              ? confirmBulkDelete
              : confirmDeleteUser
          }
          userName={userToDelete?.name || "this user"}
        />
      </div>
    </LoadingOverlay>
  );
};

export default UsersWithContext;
