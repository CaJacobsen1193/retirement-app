// frontend/src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // 1) Track the form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  // 2) Hook for programmatic navigation
  const navigate = useNavigate();

  // Get the role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  // 3) On submit, prevent reload & "log in"
  const handleSubmit = e => {
    e.preventDefault();
    console.log('Logging in with:', { email, password, role });
    // TODO: call your real auth API here
    navigate('/residents');  // go to the resident selection page
  };

  const colors = {
    mahogany: '#8B2323',
    beige: '#F5F5DC',
    textDark: '#333333',
    textLight: '#F5F5DC',
  };

  return (
    <div style={{
      backgroundColor: colors.beige,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 32,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        border: `2px solid ${colors.mahogany}`
      }}>
        <h2 style={{
          color: colors.mahogany,
          textAlign: 'center',
          marginBottom: 24,
          fontSize: '1.8rem'
        }}>
          {role} Login
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ margin: '16px 0' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: 12,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ margin: '16px 0' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: 12,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              width: '100%',
              padding: '12px 16px',
              backgroundColor: colors.mahogany,
              color: colors.textLight,
              border: 'none',
              borderRadius: 6,
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: 16
            }}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}