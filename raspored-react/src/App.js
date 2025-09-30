import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-bold text-center text-primary-600">
            Raspored Nastave
          </h1>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
