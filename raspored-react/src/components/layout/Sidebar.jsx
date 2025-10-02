import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Users, BookOpen, Settings, BarChart } from 'lucide-react';

const Sidebar = () => {
  const { isAdmin, isStudent } = useAuth();

  /* const studentLinks = [
    { label: 'Moj Raspored', icon: Calendar, path: '/student' },
    { label: 'Prisustvo', icon: BarChart, path: '/student/attendance' },
    { label: 'Podešavanja', icon: Settings, path: '/profile' },
  ];

  const adminLinks = [
    { label: 'Dashboard', icon: BarChart, path: '/admin' },
    { label: 'Korisnici', icon: Users, path: '/admin/users' },
    { label: 'Predmeti', icon: BookOpen, path: '/admin/subjects' },
    { label: 'Raspored', icon: Calendar, path: '/admin/schedules' },
    { label: 'Statistika', icon: BarChart, path: '/admin/stats' }
  ]; */

  const links = isAdmin ? adminLinks : isStudent ? studentLinks : [];

  return (
    <aside className="w-64 bg-gradient-to-b from-orange-50 to-pink-50 h-full p-4 border-r border-orange-200">
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.path}
              href={link.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-700 hover:text-orange-600"
            >
              <Icon size={20} className="text-orange-400" />
              <span className="font-medium">{link.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;