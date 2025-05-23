import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex' }}>
      {/* Left column: sidebar */}
      <Sidebar />

      {/* Right column: the current page */}
      <main style={{ flex: 1, overflowY: 'auto', height: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
