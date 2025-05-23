// frontend/src/components/LandingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  
  const colors = {
    mahogany: '#8B2323',
    beige: '#F5F5DC',
    textDark: '#333333',
    textLight: '#F5F5DC',
  };
  
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Store the role in localStorage for use across the app
    localStorage.setItem('userRole', role);
    navigate('/login');
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
      <h1 style={{
        color: colors.mahogany,
        marginBottom: 48,
        fontSize: '2.5rem',
        textAlign: 'center'
      }}>
        Welcome to Resident Care
      </h1>
      
      <h2 style={{
        color: colors.textDark,
        marginBottom: 24,
        fontSize: '1.8rem',
        textAlign: 'center'
      }}>
        Please Select Your Role
      </h2>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',        // Center row
        flexWrap: 'nowrap',              // Never wrap
        gap: 24,
        width: '100%',
        maxWidth: 1000,                  // Container max width
        margin: '0 auto',
        padding: '0 12px'
      }}>
        {['User', 'Resident', 'Residential Employee'].map(role => (
          <div
            key={role}
            onClick={() => handleRoleSelect(role)}
            style={{
              flex: '1 1 0',              // All cards shrink equally
              maxWidth: 300,             // But never exceed 300px
              cursor: 'pointer',
              border: `2px solid ${colors.mahogany}`,
              borderRadius: 12,
              padding: 24,
              textAlign: 'center',
              backgroundColor: 'white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 16px',
              border: `3px solid ${colors.mahogany}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.mahogany,
              color: colors.textLight,
              fontSize: '2rem'
            }}>
              {role.charAt(0)}
            </div>
            
            <h3 style={{ 
              margin: '12px 0', 
              color: colors.mahogany,
              fontSize: '1.4rem'
            }}>
              {role}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
