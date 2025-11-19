import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserManagement from './pages/userManagement/UserManagement';

function App() {

  return (
    <Router>
      <main>
        <Routes>
          <Route path='/' element={<UserManagement />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
