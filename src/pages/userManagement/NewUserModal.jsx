import "./styles/userManagement.css";

export default function NewUserModal({ close }) {
  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Create New User</h3>
        
        <div className="modal-input-group">
          <input className="modal-input" placeholder="Full Name" />
          <input className="modal-input" placeholder="Email" />
          <select className="modal-select">
            <option>Admin</option>
            <option>Contributor</option>
            <option>Viewer</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={close}>Cancel</button>
          <button className="modal-btn-create">Create</button>
        </div>
      </div>
    </div>
  );
}