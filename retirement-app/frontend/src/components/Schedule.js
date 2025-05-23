// frontend/src/components/Schedule.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Mock resident details (for the header)
const MOCK_RESIDENT_DETAILS = {
  r1: { name: 'Alice Johnson' },
  r2: { name: 'Bob Smith' },
  r3: { name: 'Carol Lee' },
};

// Converted to initial state for mutability
const INITIAL_APPOINTMENTS = {
  r1: [
    { id: 'a1', type: 'Doctor Appointment', datetime: '2025-04-22T10:00', description: 'Check-up with Dr. Patel' },
    { id: 'a2', type: 'Physical Therapy', datetime: '2025-04-25T14:30', description: 'PT session, Room 2' },
  ],
  r2: [
    { id: 'b1', type: 'Dentist', datetime: '2025-04-23T09:00', description: 'Dental cleaning' },
  ],
  r3: [
    { id: 'c1', type: 'Eye Exam', datetime: '2025-04-24T11:15', description: 'Vision check' },
  ],
};

const INITIAL_ACTIVITIES = [
  { id: 'e1', datetime: '2025-04-21T18:00', description: 'Bingo Night (Common Room)' },
  { id: 'e2', datetime: '2025-04-23T15:00', description: 'Garden Club Walk' },
  { id: 'e3', datetime: '2025-04-26T19:00', description: 'Movie Night: classic films' },
];

export default function Schedule() {
  const { residentId } = useParams();
  const resident = MOCK_RESIDENT_DETAILS[residentId] || { name: residentId };
  const userRole = localStorage.getItem('userRole') || 'Resident';
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date('2025-04-21'));
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS[residentId] || []);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', startTime: '', endTime: '' });
  const [draggedCategory, setDraggedCategory] = useState(null);
  const [dropTarget, setDropTarget] = useState({ date: null, hour: null });

  const colors = {
    mahogany: '#8B2323',
    beige: '#F5F5DC',
    textDark: '#333333',
    textLight: '#F5F5DC',
    appointmentColor: '#8B2323',
    activityColor: '#4682B4',
  };

  useEffect(() => {
    const appointmentEvents = appointments.map(a => ({
      ...a, eventType: 'appointment', color: colors.appointmentColor
    }));
    const activityEvents = activities.map(a => ({
      ...a, eventType: 'activity', color: colors.activityColor
    }));
    const combinedEvents = [...appointmentEvents, ...activityEvents]
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    setEvents(combinedEvents);
  }, [appointments, activities]);

  const getDaysForView = () => {
    const days = [];
    const start = new Date(currentDate);
    if (view === 'day') {
      days.push(new Date(start));
    } else if (view === 'week') {
      const dow = start.getDay();
      start.setDate(start.getDate() - dow);
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
      }
    } else {
      start.setDate(1);
      const firstDow = start.getDay();
      start.setDate(start.getDate() - firstDow);
      for (let i = 0; i < 42; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
      }
    }
    return days;
  };

  const getEventsForDay = day =>
    events.filter(e => {
      const d = new Date(e.datetime);
      return d.getDate() === day.getDate() &&
             d.getMonth() === day.getMonth() &&
             d.getFullYear() === day.getFullYear();
    });

  const goToPrevious = () => {
    const d = new Date(currentDate);
    if (view === 'day')      d.setDate(d.getDate() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else                     d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };
  const goToNext = () => {
    const d = new Date(currentDate);
    if (view === 'day')      d.setDate(d.getDate() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else                     d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const formatViewHeader = () => {
    if (view === 'day') {
      return currentDate.toLocaleDateString(undefined, {
        weekday:'long', year:'numeric', month:'long', day:'numeric'
      });
    } else if (view === 'week') {
      const days = getDaysForView();
      const first = days[0], last = days[6];
      return `${first.toLocaleDateString(undefined,{month:'short',day:'numeric'})} - ${last.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}`;
    } else {
      return currentDate.toLocaleDateString(undefined,{year:'numeric',month:'long'});
    }
  };

  const handleDragStart = (e, category) => {
    if (category === 'appointment' && userRole === 'Resident') {
      alert('Residents can only add community activities.');
      return;
    }
    setDraggedCategory(category);
    e.dataTransfer.setData('text/plain', category);
  };

  const handleDrop = (e, date, hour = null) => {
    e.preventDefault();
    const category = e.dataTransfer.getData('text/plain');
    if (!category || (category === 'appointment' && userRole === 'Resident')) return;
    setDropTarget({ date, hour });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert('Please fill in all fields.');
      return;
    }
    const baseDate = dropTarget.date || new Date();
    const startDateTime = new Date(`${baseDate.toDateString()} ${newEvent.startTime}`);
    const endDateTime = new Date(`${baseDate.toDateString()} ${newEvent.endTime}`);
    if (endDateTime <= startDateTime) {
      alert('End time must be after start time.');
      return;
    }
    const newEventData = {
      id: `e${Date.now()}`,
      datetime: startDateTime.toISOString(),
      description: newEvent.title,
      eventType: draggedCategory,
      color: draggedCategory === 'appointment' ? colors.appointmentColor : colors.activityColor,
    };
    if (draggedCategory === 'appointment') {
      setAppointments(prev => [...prev, newEventData]);
    } else {
      setActivities(prev => [...prev, newEventData]);
    }
    setIsModalOpen(false);
    setNewEvent({ title: '', startTime: '', endTime: '' });
    setDraggedCategory(null);
    setDropTarget({ date: null, hour: null });
  };

  const renderDayView = () => {
    const day = getDaysForView()[0];
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: '70vh',
        overflowY: 'auto'
      }}>
        {Array.from({ length: 24 }).map((_, hour) => {
          const evs = getEventsForDay(day).filter(e => new Date(e.datetime).getHours() === hour);
          return (
            <div
              key={hour}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, day, hour)}
              style={{
                display: 'flex',
                borderBottom: '1px solid #eee',
                height: 60,
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: 60,
                padding: '4px 8px',
                textAlign: 'right',
                color: '#666',
                borderRight: '1px solid #eee'
              }}>
                {hour}:00
              </div>
              <div style={{ flex: 1, padding: 4, overflow: 'hidden' }}>
                {evs.map(e => (
                  <div key={e.id} style={{
                    backgroundColor: e.color,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                    marginBottom: 4,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {e.description}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getDaysForView();
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid #ddd',
          paddingBottom: 8,
          marginBottom: 8
        }}>
          {days.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '8px 0', fontWeight: 'bold' }}>
              {d.toLocaleDateString(undefined, { weekday: 'short' })}<br/>
              <span style={{
                display: 'inline-block',
                width: 30, height: 30, lineHeight: '30px',
                borderRadius: '50%',
                backgroundColor: d.toDateString() === new Date().toDateString() ? colors.mahogany : 'transparent',
                color: d.toDateString() === new Date().toDateString() ? 'white' : 'inherit'
              }}>
                {d.getDate()}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          height: '60vh',
          overflowY: 'auto'
        }}>
          {days.map((d, i) => {
            const evs = getEventsForDay(d);
            return (
              <div
                key={i}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, d)}
                style={{
                  borderRight: i < 6 ? '1px solid #eee' : 'none',
                  padding: '4px 8px',
                  height: '100%',
                  overflow: 'hidden'
                }}
              >
                {evs.map(e => (
                  <div key={e.id} style={{
                    backgroundColor: e.color,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                    marginBottom: 4,
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {`${new Date(e.datetime).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })} – ${e.description}`}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysForView().slice(0, 35);
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: '60vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid #ddd',
          paddingBottom: 8,
          marginBottom: 8
        }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontWeight: 'bold' }}>{d}</div>
          ))}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'repeat(5, 1fr)',
          height: '100%'
        }}>
          {days.map((d, i) => {
            const evs = getEventsForDay(d);
            const isCurrent = d.getMonth() === currentDate.getMonth();
            return (
              <div
                key={i}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, d)}
                style={{
                  border: '1px solid #eee',
                  padding: 4,
                  backgroundColor: isCurrent ? 'white' : '#f9f9f9',
                  color: isCurrent ? 'inherit' : '#aaa',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  textAlign: 'right',
                  fontWeight: d.getDate() === 1 ? 'bold' : 'normal',
                  marginBottom: 4
                }}>{d.getDate()}</div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  fontSize: '0.7rem',
                  overflow: 'hidden'
                }}>
                  {evs.slice(0, 3).map(e => (
                    <div key={e.id} style={{
                      backgroundColor: e.color,
                      color: 'white',
                      padding: '2px 4px',
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {e.eventType === 'appointment' ? '🩺' : '🎭'} {e.description}
                    </div>
                  ))}
                  {evs.length > 3 && (
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#666',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>+{evs.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: colors.beige,
      minHeight: '100vh',
      paddingTop: 24,
      paddingBottom: 24
    }}>
      <div style={{
        maxWidth: 1000,
        margin: '0 auto',
        paddingLeft: 16,
        paddingRight: 16
      }}>
        <h2 style={{
          textAlign: 'center',
          color: colors.mahogany,
          marginBottom: 24,
          fontSize: '2rem'
        }}>
          {resident.name}’s Schedule
        </h2>

        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <button onClick={goToPrevious} style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            border: `1px solid ${colors.mahogany}`,
            borderRadius: 4,
            cursor: 'pointer',
            color: colors.mahogany
          }}>{'< Previous'}</button>
          <h3 style={{ margin: 0, color: colors.mahogany }}>{formatViewHeader()}</h3>
          <button onClick={goToNext} style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            border: `1px solid ${colors.mahogany}`,
            borderRadius: 4,
            cursor: 'pointer',
            color: colors.mahogany
          }}>{'Next >'}</button>
        </div>

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 16
        }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: 8,
            overflow: 'hidden',
            border: `1px solid ${colors.mahogany}`
          }}>
            {['day','week','month'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: view === v ? colors.mahogany : 'white',
                  color: view === v ? 'white' : colors.mahogany,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: view === v ? 'bold' : 'normal',
                  textTransform: 'capitalize'
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Icons + Calendar */}
        <div style={{ display: 'flex' }}>
          {/* Draggable Icons aligned with top-left of calendar */}
          <div style={{ width: 100, marginRight: 16 }}>
            <h4 style={{ color: colors.mahogany, marginBottom: 8 }}>Add Event</h4>
            <div
              draggable
              onDragStart={e => handleDragStart(e, 'activity')}
              style={{
                width: '100%',
                height: 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
                background: colors.activityColor,
                color: 'white',
                borderRadius: 4,
                cursor: 'grab',
                textAlign: 'center'
              }}
              title="Drag to add a community activity"
            >
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>🎭</span>
              <span style={{ marginTop: 4, fontSize: '0.9rem', fontWeight: 'bold' }}>Activity</span>
            </div>
            {(userRole === 'User' || userRole === 'Residential Employee') && (
              <div
                draggable
                onDragStart={e => handleDragStart(e, 'appointment')}
                style={{
                  width: '100%',
                  height: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colors.appointmentColor,
                  color: 'white',
                  borderRadius: 4,
                  cursor: 'grab',
                  textAlign: 'center'
                }}
                title="Drag to add a medical appointment"
              >
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>🩺</span>
                <span style={{ marginTop: 4, fontSize: '0.9rem', fontWeight: 'bold' }}>Appointment</span>
              </div>
            )}
          </div>

          {/* Calendar Display */}
          <div style={{ flex: 1 }}>
            {view === 'day'   && renderDayView()}
            {view === 'week'  && renderWeekView()}
            {view === 'month' && renderMonthView()}

            {/* Legend */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors.appointmentColor,
                  marginRight: 8,
                  borderRadius: 4
                }} />
                <span>Medical Appointments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors.activityColor,
                  marginRight: 8,
                  borderRadius: 4
                }} />
                <span>Community Activities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Event Form */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: 24,
            borderRadius: 8,
            width: 400,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            <h3>Add {draggedCategory === 'appointment' ? 'Medical Appointment' : 'Community Activity'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Start Time (HH:MM):</label>
                <input
                  type="time"
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>End Time (HH:MM):</label>
                <input
                  type="time"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: 8 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Cancel</button>
                <button type="submit" style={{ background: colors.mahogany, color: 'white', padding: '8px 16px', border: 'none', borderRadius: 4 }}>Add Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
