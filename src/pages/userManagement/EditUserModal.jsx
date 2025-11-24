import "./styles/userManagement.css";
import { useState } from "react";

export default function EditUserModal({ close, editUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Viewer",
    location: ""
  });

  const handleSubmit = () => {
    if (formData.name && formData.email) {
      editUser(formData);
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Edit User</h3>

        <div className="modal-input-group">
          <input 
            className="modal-input" 
            placeholder="Full Name *" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          />
          <input 
            className="modal-input" 
            placeholder="Email *" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
          <input 
            className="modal-input" 
            placeholder="Location" 
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
          />
          <select 
            className="modal-select" 
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Admin">Admin</option>
            <option value="Contributor">Contributor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={close}>Cancel</button>
          <button className="modal-btn-create" onClick={handleSubmit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}