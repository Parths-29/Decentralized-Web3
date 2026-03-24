import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import VotingDashboard from './components/VotingDashboard';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <VotingDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        {/* Default Route handles redirects safely based on role */}
        <Route path="*" element={<Navigate to={isAuthenticated ? (role === 'admin' ? "/admin" : "/dashboard") : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
