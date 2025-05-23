// frontend/src/components/Residents.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestsData } from '../data/requests';

// Mock data for demonstration
const MOCK_RESIDENTS = [
  { id: 'r1', name: 'Alice Johnson', room: '201A' },
  { id: 'r2', name: 'Bob Smith',     room: '103B' },
  { id: 'r3', name: 'Carol Lee',     room: '305C' },
];

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const navigate = useNavigate();

  // Recompute unread counts each time this component mounts
  useEffect(() => {
    const withCounts = MOCK_RESIDENTS.map(res => ({
      ...res,
      requestCount: (requestsData[res.id] || []).filter(r => !r.completed).length
    }));
    setResidents(withCounts);
  }, []); // empty deps → runs on every mount

  const handleSelect = (id) => {
    navigate(`/residents/${id}/feed`);
  };

  const colors = {
    mahogany:  '#8B2323',
    beige:     '#F5F5DC',
    textDark:  '#333333',
    textLight: '#F5F5DC',
  };

  return (
    <div style={{
      padding: 24,
      backgroundColor: colors.beige,
      minHeight: '100vh'
    }}>
      <h2 style={{
        width: '100%',
        textAlign: 'center',
        color: colors.mahogany,
        marginBottom: 24,
        fontSize: '2rem'
      }}>
        Select a Resident
      </h2>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 24,
        marginTop: 16,
        padding: '0 12px'
      }}>
        {residents.map(res => (
          <div
            key={res.id}
            onClick={() => handleSelect(res.id)}
            style={{
              flex: '0 0 200px',
              cursor: 'pointer',
              border: `2px solid ${colors.mahogany}`,
              borderRadius: 12,
              padding: 20,
              textAlign: 'center',
              backgroundColor: 'white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease'
            }}
          >
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 16px',
              border: `3px solid ${colors.mahogany}`
            }}>
              <img
              src={localStorage.getItem(`profile_${res.id}`) || "https://via.placeholder.com/100/582F0E/FFFFFF?text=Resident"}  // Updated: Load from localStorage or fallback
              alt={`${res.name}'s profile`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            </div>

            <h3 style={{ margin: '8px 0', color: colors.textDark }}>
              {res.name}
            </h3>
            <p style={{ margin: '4px 0', color: '#555' }}>
              Room: {res.room}
            </p>

            {res.requestCount > 0 && (
              <div style={{
                backgroundColor: colors.mahogany,
                color: colors.textLight,
                padding: '4px 8px',
                borderRadius: 16,
                marginTop: 12,
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {res.requestCount} Unread {res.requestCount === 1 ? 'Request' : 'Requests'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
