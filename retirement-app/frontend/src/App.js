// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Residents from './components/Residents';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Schedule from './components/Schedule';
import Requests from './components/Requests';
import Layout from './components/Layout';

function App() {
  return (
  <Router>
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Resident Selection */}
      <Route path="/residents" element={<Residents />} />

      {/* Protected: any URL under /residents/:residentId */}
      <Route path="/residents/:residentId" element={<Layout />}>
        {/* default landing—redirects to feed */}
        <Route index element={<Navigate to="feed" replace />} />

        <Route path="feed" element={<Feed />} />
        <Route path="profile" element={<Profile />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="requests" element={<Requests />} />
      </Route>
    </Routes>
  </Router>
  );
}

export default App;