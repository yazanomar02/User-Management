import { useState } from "react";
import "./styles/userManagement.css";
import UsersTable from "./UsersTable";
import NewUserModal from "./NewUserModal";

export default function UserManagement() {
  const [open, setOpen] = useState(false);

  return (
    <div className="user-management-page">
      <h2 className="um-title">User Management</h2>

      <div className="um-filters">
        <input 
          className="um-input" 
          placeholder="Search items..." 
        />

        <div className="um-select-wrapper">
          <label className="um-select-label">Permissions:</label>
          <select className="um-select">
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="contributor">Contributor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="um-select-wrapper">
          <label className="um-select-label">Joined:</label>
          <select className="um-select">
            <option value="Anytime">Anytime</option>
            <option value="Last Month">Last Month</option>
            <option value="Last Year">Last Year</option>
          </select>
        </div>
        
        <button className="um-btn">Export</button>

        <button className="um-btn-primary" onClick={() => setOpen(true)}>
          + New User
        </button>
      </div>

      <UsersTable />

      {open && <NewUserModal close={() => setOpen(false)} />}
    </div>
  );
}