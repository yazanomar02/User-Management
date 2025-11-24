import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserManagement from './pages/userManagement/UserManagement';
import UserProfile from './pages/userProfile/UserProfile';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path='/' element={<UserManagement />} />
          <Route path="/user/:userId" element={<UserProfile />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App