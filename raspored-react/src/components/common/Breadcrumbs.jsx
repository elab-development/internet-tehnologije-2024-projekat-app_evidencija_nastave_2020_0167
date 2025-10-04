import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNameMap = {
    'admin': 'Dashboard',
    'student': 'Dashboard',
    'guest': 'Dashboard',
    'users': 'Korisnici',
    'subjects': 'Predmeti',
    'profile': 'Profil',
    'dashboard': 'Dashboard'
  };
  //komentar

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:text-orange-600 flex items-center">
        <Home size={16} />
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbNameMap[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={16} className="text-gray-400" />
            {isLast ? (
              <span className="text-orange-600 font-medium">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-orange-600">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;