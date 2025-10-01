import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={16} className="text-pink-300" />}
          {item.path ? (
            <a 
              href={item.path}
              className="hover:text-orange-600 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-orange-600 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;