import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import UserNavbar from './UserNavbar';

export default function UserLayout({ children }) {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  if (!user || user.role !== 'user') {
    return <div className="container-fluid py-5"><h2>Unauthorized</h2></div>;
  }
  const hideFooter = location.pathname === '/login' || location.pathname === '/user/login';
  return (
    <div className="user-layout bg-light min-vh-100 d-flex flex-column">
      <UserNavbar user={user} />
      <main className="flex-grow-1 py-4">
        <div className="container-fluid px-2 px-md-3">
          {children}
        </div>
      </main>
      {!hideFooter && (
        <footer className="footer_area text-white mt-auto">
          <div className="container text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} CompileCraft. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
} 