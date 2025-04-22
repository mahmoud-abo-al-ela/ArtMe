import React from "react";
import ConfirmationDialog from "../common/ConfirmDialog";

const UserDeleteConfirmation = ({ isOpen, onClose, onConfirm, userName }) => {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete User"
      message={`Are you sure you want to delete ${userName}? All artworks created by this user will also be permanently deleted. This action cannot be undone.`}
      confirmText="Delete"
      confirmButtonType="danger"
      type="error"
    />
  );
};

export default UserDeleteConfirmation;
