import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ActionMenu({ onDelete, onEdit, onPatch, userId }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      onDelete(userId);
    }
    setOpen(false);
  };

  const handleEdit = () => {
    onEdit(userId);
    setOpen(false);
  };

  const handleChangeRole = async (newRole) => {
    try {
      await onPatch(userId, { role: newRole });
      setOpen(false);
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  return (
    <div className="action-menu-container" ref={dropdownRef}>
      <button className="action-btn" onClick={() => setOpen(!open)}>
        ⋮
      </button>

      {open && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={() => {
            navigate(`/user/${userId}`);
            setOpen(false);
          }}>
            Show Profile
          </button>

          <button className="dropdown-item" onClick={handleEdit}>
            Edit
          </button>

          <div className="role-section">
            <div className="role-section-label">Change Role</div>
            <button
              className="dropdown-item dropdown-item-role admin"
              onClick={() => handleChangeRole('Admin')}
            >
              Make Admin
            </button>
            <button
              className="dropdown-item dropdown-item-role contributor"
              onClick={() => handleChangeRole('Contributor')}
            >
              Make Contributor
            </button>
            <button
              className="dropdown-item dropdown-item-role viewer"
              onClick={() => handleChangeRole('Viewer')}
            >
              Make Viewer
            </button>
          </div>

          <button className="dropdown-item delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}