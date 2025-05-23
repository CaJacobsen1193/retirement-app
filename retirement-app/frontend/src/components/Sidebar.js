// frontend/src/components/Sidebar.js
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

export default function Sidebar() {
  const { residentId } = useParams();

  // Base path for this resident
  const base = `/residents/${residentId}`;

  const colors = {
    mahogany: '#8B2323',
    beige: '#F5F5DC',
    textDark: '#333333',
    textLight: '#F5F5DC',
  };

  // Common link styles
  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '12px 16px',
    margin: '8px 0',
    textDecoration: 'none',
    color: isActive ? colors.textLight : colors.textDark,
    background: isActive ? colors.mahogany : 'white',
    borderRadius: 8,
    fontWeight: isActive ? 'bold' : 'normal',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: `1px solid ${isActive ? colors.mahogany : '#ddd'}`,
  });

  return (
    <nav
      style={{
        width: 220,
        padding: 16,
        borderRight: `2px solid ${colors.mahogany}`,
        height: '100vh',
        boxSizing: 'border-box',
        backgroundColor: colors.beige,
      }}
    >
      <h3 style={{ 
        marginTop: 0, 
        color: colors.mahogany,
        textAlign: 'center',
        fontSize: '1.5rem',
        borderBottom: `2px solid ${colors.mahogany}`,
        paddingBottom: 12,
        marginBottom: 20
      }}>
        Navigation
      </h3>
      <NavLink to={`${base}/feed`}      style={linkStyle}>Feed</NavLink>
      <NavLink to={`${base}/profile`}   style={linkStyle}>Profile</NavLink>
      <NavLink to={`${base}/schedule`}  style={linkStyle}>Schedule</NavLink>
      <NavLink to={`${base}/requests`}  style={linkStyle}>Requests</NavLink>
      <NavLink to="/residents" end       style={linkStyle}>← Back to Residents</NavLink>
    </nav>
  );
}