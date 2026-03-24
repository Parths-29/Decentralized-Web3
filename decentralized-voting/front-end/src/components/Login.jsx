import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      
      if (res.data.role === 'admin') {
         window.location.href = '/admin';
      } else {
         window.location.href = '/dashboard';
      }
    } catch(err) {
      alert(err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed');
    }
  };

  return (
    <div className="white-card">
      <h1 style={{margin: '0 0 24px'}}>Sign In</h1>
      <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <input 
          className="select-account" 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
          style={{marginBottom: '0'}}
        />
        <input 
          type="password"
          className="select-account" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{marginBottom: '0'}}
        />
        <button type="submit" className="btn" style={{marginTop: '16px'}}>Log In</button>
      </form>
      <div style={{textAlign: 'center', marginTop: '24px', color: '#6b7280', fontSize: '0.9rem'}}>
        Default Admin Node: <span style={{color: '#111827', fontWeight: 'bold'}}>admin</span> / <span style={{color: '#111827', fontWeight: 'bold'}}>parth123</span>
      </div>
      <p style={{textAlign: 'center', marginTop: '24px', color: '#6b7280'}}>
        Don't have an account? <Link to="/signup" style={{color: '#2563eb', textDecoration: 'none'}}>Sign up securely</Link>
      </p>
    </div>
  );
}
