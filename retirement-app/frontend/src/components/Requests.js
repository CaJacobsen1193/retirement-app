// frontend/src/components/Requests.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { requestsData } from '../data/requests';

export default function Requests() {
  const { residentId } = useParams();
  const [requests, setRequests] = useState([]);
  const [newType, setNewType] = useState('Item');
  const [newText, setNewText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requestToComplete, setRequestToComplete] = useState(null);

  const colors = {
    mahogany: '#8B2323',
    beige:    '#F5F5DC',
    textDark: '#333333',
    textLight:'#F5F5DC',
  };

  // Load requests for this resident on mount (or when residentId changes)
  useEffect(() => {
    setRequests(requestsData[residentId] || []);
  }, [residentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newReq = {
      id:        `${residentId}-rq-${Date.now()}`,
      type:      newType,
      text:      newText.trim(),
      timestamp: Date.now(),
      completed: false,
    };

    const updated = [newReq, ...requests];
    requestsData[residentId] = updated;
    setRequests(updated);
    setNewText('');
  };

  const handleCheckboxChange = (requestId) => {
    const toComplete = requests.find(req => req.id === requestId);
    if (toComplete && !toComplete.completed) {
      setRequestToComplete(requestId);
      setShowConfirmation(true);
    }
  };

  const confirmCompletion = () => {
    const updated = requests.map(req =>
      req.id === requestToComplete
        ? { ...req, completed: true }
        : req
    );
    requestsData[residentId] = updated;
    setRequests(updated);
    setShowConfirmation(false);
    setRequestToComplete(null);
  };

  const cancelCompletion = () => {
    setShowConfirmation(false);
    setRequestToComplete(null);
  };

  const activeRequests    = requests.filter(req => !req.completed);
  const completedRequests = requests.filter(req => req.completed);

  return (
    <div style={{
      backgroundColor: colors.beige,
      minHeight:       '100vh',
      paddingTop:      24,
      paddingBottom:   24
    }}>
      <div style={{
        maxWidth: 800,
        margin:   '0 auto',
        padding:  16
      }}>
        <h2 style={{
          textAlign:    'center',
          color:        colors.mahogany,
          marginBottom: 24,
          fontSize:     '2rem'
        }}>
          Requests
        </h2>

        {/* New Request Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius:    12,
          padding:         24,
          boxShadow:       '0 4px 8px rgba(0,0,0,0.1)',
          border:          `2px solid ${colors.mahogany}`,
          marginBottom:    24
        }}>
          <h3 style={{
            color:         colors.mahogany,
            marginTop:     0,
            borderBottom:  `2px solid ${colors.mahogany}`,
            paddingBottom: 8
          }}>
            New Request
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display:      'block',
                marginBottom: 8,
                color:        colors.textDark
              }}>
                Type:
              </label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value)}
                style={{ padding: 8, width: '100%', borderRadius: 6, border: '1px solid #ccc' }}
              >
                <option value="Item">Item Request</option>
                <option value="Visit">Visit Request</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display:      'block',
                marginBottom: 8,
                color:        colors.textDark
              }}>
                Description:
              </label>
              <textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="Describe your request..."
                rows={3}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                required
              />
            </div>
            <button 
              type="submit" 
              style={{
                padding:         '10px 16px',
                backgroundColor: colors.mahogany,
                color:           colors.textLight,
                border:          'none',
                borderRadius:    6,
                cursor:          'pointer',
                fontWeight:      'bold'
              }}
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Active Requests */}
        <div style={{
          backgroundColor: 'white',
          borderRadius:    12,
          padding:         24,
          boxShadow:       '0 4px 8px rgba(0,0,0,0.1)',
          border:          `2px solid ${colors.mahogany}`,
          marginBottom:    24
        }}>
          <h3 style={{
            color:         colors.mahogany,
            marginTop:     0,
            borderBottom:  `2px solid ${colors.mahogany}`,
            paddingBottom: 8
          }}>
            Active Requests
          </h3>
          
          {activeRequests.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {activeRequests.map(req => (
                <li key={req.id} style={{
                  margin:        '12px 0',
                  padding:       '12px',
                  borderLeft:    `4px solid ${colors.mahogany}`,
                  backgroundColor: colors.beige,
                  borderRadius:  '0 4px 4px 0',
                  display:       'flex',
                  alignItems:    'center'
                }}>
                  <input
                    type="checkbox"
                    checked={req.completed}
                    onChange={() => handleCheckboxChange(req.id)}
                    style={{ marginRight: 12 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      marginBottom: 4,
                      fontSize:     14,
                      color:        '#555'
                    }}>
                      <strong>{req.type}</strong> • {new Date(req.timestamp).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 16 }}>{req.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No active requests.</p>
          )}
        </div>

        {/* Completed Requests */}
        <div style={{
          backgroundColor: 'white',
          borderRadius:    12,
          padding:         24,
          boxShadow:       '0 4px 8px rgba(0,0,0,0.1)',
          border:          `2px solid ${colors.mahogany}`
        }}>
          <h3 style={{
            color:         colors.mahogany,
            marginTop:     0,
            borderBottom:  `2px solid ${colors.mahogany}`,
            paddingBottom: 8
          }}>
            Completed Requests
          </h3>
          
          {completedRequests.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {completedRequests.map(req => (
                <li key={req.id} style={{
                  margin:        '12px 0',
                  padding:       '12px',
                  borderLeft:    `4px solid #999`,
                  backgroundColor: '#f0f0f0',
                  borderRadius:  '0 4px 4px 0',
                  display:       'flex',
                  alignItems:    'center',
                  color:         '#777'
                }}>
                  <input
                    type="checkbox"
                    checked
                    disabled
                    style={{ marginRight: 12 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 4, fontSize: 14 }}>
                      <strong>{req.type}</strong> • {new Date(req.timestamp).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 16 }}>{req.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No completed requests.</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div style={{
          position:    'fixed',
          top:         0,
          left:        0,
          right:       0,
          bottom:      0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'center',
          zIndex:      1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding:         24,
            borderRadius:    12,
            maxWidth:        400,
            width:           '90%',
            boxShadow:       '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ color: colors.mahogany, marginTop: 0 }}>Confirm Completion</h3>
            <p>Are you sure you want to mark this request as completed?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button 
                onClick={cancelCompletion}
                style={{
                  padding:      '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border:      '1px solid #ccc',
                  borderRadius: 4,
                  cursor:      'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmCompletion}
                style={{
                  padding:         '8px 16px',
                  backgroundColor: colors.mahogany,
                  color:           colors.textLight,
                  border:          'none',
                  borderRadius:    4,
                  cursor:          'pointer'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
