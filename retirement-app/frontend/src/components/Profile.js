// frontend/src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Mock resident details data
const MOCK_RESIDENT_DETAILS = {
  r1: {
    name: 'Alice Johnson',
    age: 82,
    room: '201A',
    medications: [
      'Lisinopril (10 mg, daily)',
      'Atorvastatin (20 mg, nightly)',
      'Aspirin (81 mg, daily)',
    ],
    interests: [
      'Knitting',
      'Reading mystery novels',
      'Bird watching',
      'Classical music',
      'Gardening'
    ],
    photos: Array(8).fill(null).map((_, i) =>
      `https://via.placeholder.com/250/582F0E/FFFFFF?text=Photo${i+1}`
    )
  },
  r2: {
    name: 'Bob Smith',
    age: 90,
    room: '103B',
    medications: [
      'Metformin (500 mg, twice daily)',
      'Warfarin (5 mg, daily)',
    ],
    interests: [
      'Chess',
      'History documentaries',
      'Woodworking',
      'Jazz music'
    ],
    photos: Array(8).fill(null).map((_, i) =>
      `https://via.placeholder.com/250/582F0E/FFFFFF?text=Photo${i+1}`
    )
  },
  r3: {
    name: 'Carol Lee',
    age: 78,
    room: '305C',
    medications: [
      'Levothyroxine (75 mcg, daily)',
    ],
    interests: [
      'Painting',
      'Cooking',
      'Traveling',
      'Playing piano',
      'Book club'
    ],
    photos: Array(8).fill(null).map((_, i) =>
      `https://via.placeholder.com/250/582F0E/FFFFFF?text=Photo${i+1}`
    )
  },
};

export default function Profile() {
  const { residentId } = useParams();
  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('medications');
  const [profileImage, setProfileImage] = useState(null);  // New: State for profile image
  const [isEditingProfile, setIsEditingProfile] = useState(false);  // New: Edit mode for profile photo
  const [isEditingInterests, setIsEditingInterests] = useState(false);  // New: Edit mode for interests
  const [editedInterests, setEditedInterests] = useState([]);  // New: Temp state for editing interests
  const [isEditingMedications, setIsEditingMedications] = useState(false);  // New: Edit mode for medications
  const [editedMedications, setEditedMedications] = useState([]);  // New: Temp state for editing medications
  const userRole = localStorage.getItem('userRole');  // New: Retrieve user role for conditional editing

  useEffect(() => {
    // Load from localStorage or fallback to mock
    const storedDetails = MOCK_RESIDENT_DETAILS[residentId] || {};
    const storedImage = localStorage.getItem(`profile_${residentId}`);
    const storedInterests = JSON.parse(localStorage.getItem(`interests_${residentId}`)) || storedDetails.interests || [];
    const storedMedications = JSON.parse(localStorage.getItem(`medications_${residentId}`)) || storedDetails.medications || [];

    setProfileImage(
      storedImage ||
      'https://via.placeholder.com/150/582F0E/FFFFFF?text=Resident'
    );
    setDetails({
      ...storedDetails,
      interests: storedInterests,
      medications: storedMedications,
      photos: storedDetails.photos || []
    });
  }, [residentId]);

  // New: Handle drag and drop for profile image
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);
        localStorage.setItem(`profile_${residentId}`, base64Image);  // Persist to localStorage
        setIsEditingProfile(false);  // Exit edit mode
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // New: Handlers for interests editing
  const startEditingInterests = () => {
    setEditedInterests([...details.interests]);
    setIsEditingInterests(true);
  };
  const handleInterestChange = (index, value) => {
    const updated = [...editedInterests];
    updated[index] = value;
    setEditedInterests(updated);
  };
  const addInterest = () => setEditedInterests([...editedInterests, '']);
  const removeInterest = (index) => setEditedInterests(editedInterests.filter((_, i) => i !== index));
  const saveInterests = () => {
    setDetails({ ...details, interests: editedInterests });
    localStorage.setItem(`interests_${residentId}`, JSON.stringify(editedInterests));
    setIsEditingInterests(false);
  };

  // New: Handlers for medications editing (similar to interests)
  const startEditingMedications = () => {
    setEditedMedications([...details.medications]);
    setIsEditingMedications(true);
  };
  const handleMedicationChange = (index, value) => {
    const updated = [...editedMedications];
    updated[index] = value;
    setEditedMedications(updated);
  };
  const addMedication = () => setEditedMedications([...editedMedications, '']);
  const removeMedication = (index) => setEditedMedications(editedMedications.filter((_, i) => i !== index));
  const saveMedications = () => {
    setDetails({ ...details, medications: editedMedications });
    localStorage.setItem(`medications_${residentId}`, JSON.stringify(editedMedications));
    setIsEditingMedications(false);
  };

  const colors = {
    mahogany: '#8B2323',
    beige: '#F5F5DC',
    textDark: '#333333',
  };

  if (!details) {
    return (
      <div
        style={{
          backgroundColor: colors.beige,
          minHeight: '100vh',
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <div style={{ padding: 24, textAlign: 'center' }}>
          <p>Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: colors.beige,
        minHeight: '100vh',
        paddingTop: 24,
        paddingBottom: 24,
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: 16,
        }}
      >
        <h2
          style={{
            width: '100%',
            textAlign: 'center',
            color: colors.mahogany,
            marginBottom: 24,
            fontSize: '2rem',
          }}
        >
          {details.name}'s Profile
        </h2>

        {/* Profile Header with Image */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            border: `2px solid ${colors.mahogany}`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 150,
              height: 150,
              margin: '0 auto 16px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${colors.mahogany}`,
              }}
            >
              <img
                src={profileImage}
                alt={`${details.name}'s profile`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Updated: Larger pencil icon overlapping the border */}
            <div
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              title="Edit Profile Photo"
              style={{
                position: 'absolute',
                bottom: -6,
                right: -6,
                cursor: 'pointer',
                backgroundColor: colors.mahogany,
                borderRadius: '50%',
                padding: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </div>
          </div>

          {/* New: Drag-and-drop zone when editing */}
          {isEditingProfile && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${colors.mahogany}`,
                borderRadius: 8,
                padding: 16,
                marginTop: 16,
                textAlign: 'center',
                backgroundColor: colors.beige,
              }}
            >
              <p>Drag and drop an image here to update profile photo</p>
            </div>
          )}

          <h3
            style={{
              margin: '8px 0',
              color: colors.mahogany,
              fontSize: '1.5rem',
            }}
          >
            {details.name}
          </h3>
          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              marginTop: 8,
            }}
          >
            <p style={{ margin: '4px 0', color: '#555' }}>
              <strong>Age:</strong> {details.age}
            </p>
            <p style={{ margin: '4px 0', color: '#555' }}>
              <strong>Room:</strong> {details.room}
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: `2px solid ${colors.mahogany}`,
            marginBottom: 24,
          }}
        >
          {['medications', 'interests', 'photos'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: activeTab === tab ? colors.mahogany : 'transparent',
                color: activeTab === tab ? colors.beige : colors.mahogany,
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${colors.mahogany}` : 'none',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            border: `2px solid ${colors.mahogany}`,
          }}
        >
          {/* Medications Tab */}
          {activeTab === 'medications' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{
                  color: colors.mahogany,
                  marginTop: 0,
                  borderBottom: `2px solid ${colors.mahogany}`,
                  paddingBottom: 8,
                }}>
                  Current Medications
                </h3>
                {/* New: Conditional edit button for Residential Employee only */}
                {userRole === 'Residential Employee' && !isEditingMedications && (
                  <button
                    onClick={startEditingMedications}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: colors.mahogany,
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditingMedications ? (
                // New: Editing UI for medications
                <div>
                  {editedMedications.map((med, idx) => (
                    <div key={idx} style={{ display: 'flex', marginBottom: 8 }}>
                      <input
                        type="text"
                        value={med}
                        onChange={(e) => handleMedicationChange(idx, e.target.value)}
                        style={{ flex: 1, padding: 8, marginRight: 8 }}
                      />
                      <button
                        onClick={() => removeMedication(idx)}
                        style={{
                          backgroundColor: 'red',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addMedication}
                    style={{
                      marginRight: 8,
                      padding: '8px',
                      backgroundColor: colors.mahogany,
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Add Medication
                  </button>
                  <button
                    onClick={saveMedications}
                    style={{
                      padding: '8px',
                      backgroundColor: 'green',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingMedications(false)}
                    style={{
                      padding: '8px',
                      marginLeft: 8,
                      backgroundColor: 'gray',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {details.medications.map((med, idx) => (
                    <li
                      key={idx}
                      style={{
                        margin: '12px 0',
                        padding: '8px 12px',
                        borderLeft: `4px solid ${colors.mahogany}`,
                        backgroundColor: colors.beige,
                        borderRadius: '0 4px 4px 0',
                      }}
                    >
                      {med}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* Interests Tab */}
          {activeTab === 'interests' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{
                  color: colors.mahogany,
                  marginTop: 0,
                  borderBottom: `2px solid ${colors.mahogany}`,
                  paddingBottom: 8,
                }}>
                  Interests & Hobbies
                </h3>
                {/* New: Edit button for interests */}
                {!isEditingInterests && (
                  <button
                    onClick={startEditingInterests}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: colors.mahogany,
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditingInterests ? (
                // New: Editing UI for interests
                <div>
                  {editedInterests.map((interest, idx) => (


                    <div key={idx} style={{ display: 'flex', marginBottom: 8 }}>
                      <input
                        type="text"
                        value={interest}
                        onChange={(e) => handleInterestChange(idx, e.target.value)}
                        style={{ flex: 1, padding: 8, marginRight: 8 }}
                      />
                      <button
                        onClick={() => removeInterest(idx)}
                        style={{
                          backgroundColor: 'red',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addInterest}
                    style={{
                      marginRight: 8,
                      padding: '8px',
                      backgroundColor: colors.mahogany,
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Add Interest
                  </button>
                  <button
                    onClick={saveInterests}
                    style={{
                      padding: '8px',
                      backgroundColor: 'green',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingInterests(false)}
                    style={{
                      padding: '8px',
                      marginLeft: 8,
                      backgroundColor: 'gray',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {details.interests.map((interest, idx) => (
                    <li
                      key={idx}
                      style={{
                        margin: '12px 0',
                        padding: '8px 12px',
                        borderLeft: `4px solid ${colors.mahogany}`,
                        backgroundColor: colors.beige,
                        borderRadius: '0 4px 4px 0',
                      }}
                    >
                      {interest}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <>
              <h3 style={{
                color: colors.mahogany,
                marginTop: 0,
                borderBottom: `2px solid ${colors.mahogany}`,
                paddingBottom: 8,
              }}>
                Photo Gallery
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 16,
                marginTop: 16,
              }}>
                {details.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '100%',
                      height: 250,
                      overflow: 'hidden',
                      borderRadius: 8,
                      border: `2px solid ${colors.mahogany}`,
                    }}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
