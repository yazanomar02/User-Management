import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./userProfile.css";
import * as api from "../../services/userService";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.getUsers();
        const userData = response.data.find(u => u.id === parseInt(userId));
        
        if (userData) {
          const formattedUser = {
            id: userData.id,
            name: userData.name,
            username: userData.username,
            email: userData.email,
            location: userData.address?.city || 'Unknown',
            street: userData.address?.street,
            suite: userData.address?.suite,
            zipcode: userData.address?.zipcode,
            geo: userData.address?.geo,
            phone: userData.phone,
            website: userData.website,
            company: userData.company?.name,
            catchPhrase: userData.company?.catchPhrase,
            bs: userData.company?.bs,
            joined: new Date(2020 + (userData.id % 3), userData.id % 12, (userData.id % 28) + 1)
              .toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
            role: ['Admin', 'Contributor', 'Viewer'][userData.id % 3],
            avatar: `https://i.pravatar.cc/150?u=${userData.id}`,
            status: "Active",
            lastLogin: `${(userData.id % 12) + 1} hours ago`,
            department: ["Engineering", "Marketing", "Sales", "Support"][userData.id % 4]
          };
          
          setUser(formattedUser);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch user data');
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading-profile">
          <div className="loading-spinner"></div>
          Loading user profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="error-profile">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="error-profile">
          <h3>User Not Found</h3>
          <p>The user you're looking for doesn't exist.</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Users
        </button>
        <h1>User Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src={user.avatar} alt={user.name} />
            <div className={`status-indicator ${user.status.toLowerCase()}`}>
              {user.status}
            </div>
          </div>
          
          <div className="profile-basic-info">
            <h2>{user.name}</h2>
            <p className="user-role">{user.role}</p>
            <p className="user-username">@{user.username}</p>
            <p className="user-email">{user.email}</p>
            <p className="user-location">{user.location}</p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Joined</span>
              <span className="stat-value">{user.joined}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Login</span>
              <span className="stat-value">{user.lastLogin}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">User ID</span>
              <span className="stat-value">#{user.id}</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <span>{user.name}</span>
              </div>
              <div className="info-item">
                <label>Username</label>
                <span>@{user.username}</span>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <span>{user.phone}</span>
              </div>
              <div className="info-item">
                <label>Website</label>
                <span>
                  <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Address Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Street</label>
                <span>{user.street}</span>
              </div>
              <div className="info-item">
                <label>Suite</label>
                <span>{user.suite}</span>
              </div>
              <div className="info-item">
                <label>City</label>
                <span>{user.location}</span>
              </div>
              <div className="info-item">
                <label>Zipcode</label>
                <span>{user.zipcode}</span>
              </div>
              <div className="info-item">
                <label>Coordinates</label>
                <span>Lat: {user.geo?.lat}, Lng: {user.geo?.lng}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Company Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Company Name</label>
                <span>{user.company}</span>
              </div>
              <div className="info-item">
                <label>Catch Phrase</label>
                <span className="catch-phrase">"{user.catchPhrase}"</span>
              </div>
              <div className="info-item">
                <label>Business</label>
                <span>{user.bs}</span>
              </div>
              <div className="info-item">
                <label>Department</label>
                <span>{user.department}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>User ID</label>
                <span>{user.id}</span>
              </div>
              <div className="info-item">
                <label>Role</label>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
              <div className="info-item">
                <label>Status</label>
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <span>{user.joined}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}