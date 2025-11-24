import { useState } from "react";
import "./styles/userManagement.css";
import UsersTable from "./UsersTable";
import NewUserModal from "./NewUserModal";
import EditUserModal from "./EditUserModal";
import useUsers from "../../hooks/useUsers";

export default function UserManagement() {
  const [openNewModal, setOpenNewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [joinedFilter, setJoinedFilter] = useState('Anytime');

  const {
    users,
    loading,
    error,
    addUser,
    editUser,
    patchUser,
    removeUser,
    refetch
  } = useUsers();

  const handleEdit = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    setEditingUser(userToEdit);
    setOpenEditModal(true);
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      await editUser(editingUser.id, updatedData);
      setOpenEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.log(error)
    }
  };

  const handlePatchUser = async (userId, partialUpdates) => {
    try {
      await patchUser(userId, partialUpdates);
    } catch (error) {
      console.error('Failed to patch user:', error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      await addUser(newUser);
      setOpenNewModal(false);
    } catch (error) {
      console.log(error)
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await removeUser(userId);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="user-management-page">
      <h2 className="um-title">User Management</h2>

      {error && (
        <div className="error-message">
          Error: {error}
          <button onClick={refetch} className="retry-btn">Retry</button>
        </div>
      )}

      <div className="um-filters">
        <input
          className="um-input"
          placeholder="Search items..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div className="um-select-wrapper">
          <label className="um-select-label">Permissions:</label>
          <select
            className="um-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Admin">Admin</option>
            <option value="Contributor">Contributor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>

        <div className="um-select-wrapper">
          <label className="um-select-label">Joined:</label>
          <select
            className="um-select"
            value={joinedFilter}
            onChange={(e) => setJoinedFilter(e.target.value)}
          >
            <option value="Anytime">Anytime</option>
            <option value="Last Month">Last Month</option>
            <option value="Last Year">Last Year</option>
          </select>
        </div>

        <button className="um-btn">Export</button>

        <button className="um-btn-primary" onClick={() => setOpenNewModal(true)}>
          + New User
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <UsersTable
          users={users}
          removeUser={handleDeleteUser}
          editUser={handleEdit}
          patchUser={handlePatchUser}
          globalFilter={globalFilter}
          roleFilter={roleFilter}
          joinedFilter={joinedFilter}
        />
      )}

      {openNewModal && (
        <NewUserModal
          close={() => setOpenNewModal(false)}
          addUser={handleAddUser}
        />
      )}

      {openEditModal && editingUser && (
        <EditUserModal
          close={() => {
            setOpenEditModal(false);
            setEditingUser(null);
          }}
          editUser={handleEditSubmit}
          user={editingUser}
        />
      )}
    </div>
  );
}