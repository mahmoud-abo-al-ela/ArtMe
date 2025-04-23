import React, { useState } from "react";
import UserList from "../components/users/UserList";
import UserEditModal from "../components/users/UserEditModal";
import UserDeleteConfirmation from "../components/users/UserDeleteConfirmation";
import LoadingOverlay from "../components/common/LoadingOverlay";
import LoadingScreen from "../components/common/LoadingScreen";
import UserHeader from "../components/users/UserHeader";
import UserSearch from "../components/users/UserSearch";
import BulkActionsBar from "../components/users/BulkActionsBar";
import Pagination from "../components/users/Pagination";
import { useUsers } from "../context/UserContext";

const Users = () => {
  const {
    paginatedUsers,
    loading,
    error,
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
    handleRoleChange,
    updateUser,
    createUser,
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
    let success;

    if (userData._id) {
      // Update existing user
      success = await updateUser(userData);
    } else {
      // Create new user
      success = await createUser(userData);
    }

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

  // Inline search results component
  const SearchResults = () => {
    if (!searchQuery) return null;

    return (
      <div className="mb-4 text-sm text-gray-500" aria-live="polite">
        Found {filteredUsers.length} user
        {filteredUsers.length !== 1 ? "s" : ""} matching "{searchQuery}"
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <LoadingScreen msg="users" />
      ) : (
        <LoadingOverlay
          isLoading={actionInProgress}
          message="Processing action..."
        >
          <div className="px-2 sm:px-4 md:px-6 max-w-screen-2xl mx-auto">
            <UserHeader
              exportUsers={exportUsers}
              handleAddUser={handleAddUser}
              filters={filters}
              setFilters={setFilters}
              isFilterMenuOpen={isFilterMenuOpen}
              setIsFilterMenuOpen={setIsFilterMenuOpen}
            />

            <div className="bg-white p-2 sm:p-4 rounded-lg shadow mb-6 overflow-hidden">
              <UserSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                handleClearSearch={handleClearSearch}
              />

              <SearchResults />

              <BulkActionsBar
                selectedUsers={selectedUsers}
                handleBulkDelete={handleBulkDelete}
              />

              <div className="overflow-x-auto -mx-2 sm:mx-0">
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
                  filters={filters}
                  setFilters={setFilters}
                  isFilterMenuOpen={isFilterMenuOpen}
                  setIsFilterMenuOpen={setIsFilterMenuOpen}
                />
              </div>

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
      )}
    </>
  );
};

export default Users;
