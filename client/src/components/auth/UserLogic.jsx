import React, { useState, useEffect } from "react";
import adminService from "../../services/admin.service";

const UserLogic = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers();
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      setError("Failed to load users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminService.deleteUser(userId);
        // Optimistic update: remove from local state immediately
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } catch (err) {
        alert("Delete failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Compute filtered list
  const filteredUsers = users.filter((user) => {
    const matchesPhone = user.phone.includes(searchTerm);
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesPhone && matchesRole;
  });

  // Pass everything down to the UI component
  return children({
    users,
    filteredUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    handleDelete,
    refresh: fetchUsers
  });
};

export default UserLogic;