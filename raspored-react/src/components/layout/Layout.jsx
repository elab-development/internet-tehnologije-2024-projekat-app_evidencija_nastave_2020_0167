import React from 'react';
import Header from './Header';
import Navigation from '../common/Navigation';
import Breadcrumbs from '../common/Breadcrumbs';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {isAuthenticated && <Navigation />}
      
      <main className="container mx-auto px-4 py-6">
        <Breadcrumbs />
        {children}
      </main>
      
      <footer className="bg-white border-t border-orange-200 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © 2025 Raspored Nastave - Fakultet organizacionih nauka
        </div>
      </footer>
    </div>
  );
};

export default Layout;