import React from 'react';
import Header from './Header';
import Navigation from '../common/Navigation';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children, showSidebar = false, sidebar }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50 flex flex-col">
      <Header />
      {isAuthenticated && <Navigation />}
      
      <main className="flex-1 flex">
        {showSidebar && sidebar && (
          <div className="hidden md:block">
            {sidebar}
          </div>
        )}
        <div className="flex-1 container-custom py-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-orange-200 py-4 mt-auto">
        <div className="container-custom text-center text-gray-600 text-sm">
          © 2025 Raspored Nastave - Fakultet organizacionih nauka
        </div>
      </footer>
    </div>
  );
};

export default Layout;