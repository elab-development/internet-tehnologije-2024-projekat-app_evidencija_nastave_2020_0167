import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut, Calendar } from 'lucide-react';
import Button from '../common/Button';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-gradient-to-r from-orange-100 to-pink-100 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* logo */}
          <div className="flex items-center gap-3">
            <Calendar size={32} className="text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-orange-600">
                Raspored Nastave
              </h1>
              <p className="text-xs text-orange-400">Student Schedule App</p>
            </div>
          </div>

          {/* meni */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <User size={20} className="text-orange-500" />
                  <span className="font-medium text-gray-700">{user?.name}</span>
                  <span className="text-sm text-pink-500">({user?.role})</span>
                </div>
                <Button variant="secondary" onClick={logout}>
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <Button onClick={() => window.location.href = '/login'}>
                Prijavi se
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;