import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/signup', { username, password });
      alert('Account securely created in MongoDB! You may now log in.');
      navigate('/login');
    } catch(err) {
      alert(err.response?.data?.message || err.response?.data?.error || err.message || 'Signup failed');
    }
  };

  return (
    <div className="white-card">
      <h1 style={{margin: '0 0 24px'}}>Create Account</h1>
      <form onSubmit={handleSignup} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <input 
          className="select-account" 
          placeholder="Choose a Web3 Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
          style={{marginBottom: '0'}}
        />
        <input 
          type="password"
          className="select-account" 
          placeholder="Create Secure Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{marginBottom: '0'}}
        />
        <button type="submit" className="btn" style={{marginTop: '16px'}}>Register Securely</button>
      </form>
      <p style={{textAlign: 'center', marginTop: '24px', color: '#6b7280'}}>
        Already registered? <Link to="/login" style={{color: '#2563eb', textDecoration: 'none'}}>Log in</Link>
      </p>
    </div>
  );
}
