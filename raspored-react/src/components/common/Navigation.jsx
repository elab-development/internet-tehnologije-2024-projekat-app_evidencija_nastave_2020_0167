import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Calendar, User, Users, BookOpen, BarChart } from 'lucide-react';

const Navigation = () => {
  const { isAuthenticated, isAdmin, isStudent, isGuest } = useAuth();

  const navItems = [
    { path: '/', label: 'Početna', icon: Home, public: true },
  ];

  if (isStudent) {
    navItems.push(
      { path: '/student', label: 'Moj Raspored', icon: Calendar },
      { path: '/profile', label: 'Profil', icon: User }
    );
  }

  if (isAdmin) {
    navItems.push(
      { path: '/admin', label: 'Dashboard', icon: BarChart },
      { path: '/admin/users', label: 'Korisnici', icon: Users },
      { path: '/admin/subjects', label: 'Predmeti', icon: BookOpen },
      { path: '/profile', label: 'Profil', icon: User },
      { path: '/admin/stats', label: 'Statistika', icon: BarChart}
    );
  }

  if (isGuest) {
    navItems.push(
      { path: '/schedule', label: 'Javni Raspored', icon: Calendar }
    );
  }

  return (
    <nav className="bg-white border-b border-orange-200">
      <div className="container-custom">
        <div className="flex gap-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors text-gray-700 hover:text-orange-600"
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;