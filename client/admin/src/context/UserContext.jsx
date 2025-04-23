import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filters, setFilters] = useState({ role: "all" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply search filter, sorting and filtering whenever users, searchQuery, or filters change
  useEffect(() => {
    let result = [...users];

    // Apply role filter
    if (filters.role !== "all") {
      result = result.filter((user) => user.role === filters.role);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(lowercasedQuery) ||
          user.email?.toLowerCase().includes(lowercasedQuery) ||
          user.role?.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      // Handle string comparison
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
    // Reset to first page when filters change
    setCurrentPage(1);
    // Clear selection when filters change
    setSelectedUsers([]);
  }, [users, searchQuery, filters, sortField, sortDirection]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionInProgress(true);
      await api.put(`/admin/users/${userId}`, { role: newRole });

      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      );

      setUsers(updatedUsers);

      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      toast.error("Error updating user role");
      console.error("Error updating user role:", err);
    } finally {
      setActionInProgress(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      setActionInProgress(true);
      const response = await api.put(`/admin/users/${userData._id}`, userData);

      const updatedUsers = users.map((user) =>
        user._id === userData._id ? response.data : user
      );
      setUsers(updatedUsers);

      toast.success("User updated successfully");
      return true;
    } catch (err) {
      toast.error("Failed to update user");
      console.error("Error updating user:", err);
      return false;
    } finally {
      setActionInProgress(false);
    }
  };

  const createUser = async (userData) => {
    try {
      setActionInProgress(true);
      const response = await api.post("/admin/register", userData);
      // Add the new user to the users list
      setUsers([...users, response.data]);
      toast.success("User created successfully");
      return true;
    } catch (err) {
      toast.error("Failed to create user");
      console.error("Error creating user:", err);
      return false;
    } finally {
      setActionInProgress(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setActionInProgress(true);
      await api.delete(`/admin/users/${userId}`);

      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);

      toast.success("User and all associated artworks deleted successfully");
      return true;
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", err);
      return false;
    } finally {
      setActionInProgress(false);
    }
  };

  const bulkDeleteUsers = async (userIds) => {
    try {
      setActionInProgress(true);
      const loadingToastId = toast.loading(
        `Deleting ${userIds.length} users...`
      );

      // Delete each user
      const deletePromises = userIds.map((id) =>
        api.delete(`/admin/users/${id}`)
      );
      await Promise.all(deletePromises);

      // Update local state
      const updatedUsers = users.filter((user) => !userIds.includes(user._id));
      setUsers(updatedUsers);

      // Clear selection
      setSelectedUsers([]);

      // Update toast to success
      toast.update(loadingToastId, {
        render: `${userIds.length} users and their artworks deleted successfully`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return true;
    } catch (err) {
      toast.error("Failed to delete some users");
      console.error("Error deleting users:", err);
      return false;
    } finally {
      setActionInProgress(false);
    }
  };

  const exportUsers = () => {
    try {
      // Create CSV content
      const headers = ["Name", "Email", "Role", "Created"];

      const csvRows = [
        headers.join(","), // Header row
        ...filteredUsers.map((user) =>
          [
            user.name || "",
            user.email || "",
            user.role || "",
            user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
          ].join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `users_export_${new Date().toISOString().slice(0, 10)}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Users exported successfully");
    } catch (error) {
      toast.error("Failed to export users");
      console.error("Error exporting users:", error);
    }
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle select all users on current page
  const handleSelectAllUsers = () => {
    // Filter out admin users from the selection
    const selectableUsers = paginatedUsers.filter(
      (user) => user.role !== "admin"
    );
    const selectableUserIds = selectableUsers.map((user) => user._id);

    // Check if all selectable users are already selected
    const allSelectableUsersSelected = selectableUserIds.every((id) =>
      selectedUsers.includes(id)
    );

    if (allSelectableUsersSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(selectableUserIds);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        filteredUsers,
        paginatedUsers,
        loading,
        error,
        actionInProgress,
        searchQuery,
        setSearchQuery,
        sortField,
        sortDirection,
        filters,
        setFilters,
        selectedUsers,
        setSelectedUsers,
        currentPage,
        totalPages,
        indexOfFirstUser,
        indexOfLastUser,
        isFilterMenuOpen,
        setIsFilterMenuOpen,
        fetchUsers,
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
