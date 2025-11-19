import { useState, useRef, useEffect } from "react";

export function ActionMenu() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="action-menu-container" ref={dropdownRef}>
      <button className="action-btn" onClick={() => setOpen(!open)}>
        ⋮
      </button>

      {open && (
        <div className="dropdown-menu">
          <button className="dropdown-item">Show</button>
          <button className="dropdown-item">Edit</button>
          <button className="dropdown-item delete">Delete</button>
        </div>
      )}
    </div>
  );
}