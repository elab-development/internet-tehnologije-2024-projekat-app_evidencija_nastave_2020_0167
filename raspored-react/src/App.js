import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-4xl font-bold text-center text-primary-600">
          Raspored Nastave
        </h1>
        <p className="text-center text-gray-600 mt-4">
          Veb aplikacija za evidenciju rasporeda nastave studenata
        </p>
        <div className="card mt-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Početni Setup</h2>
          <p className="text-gray-600">
            React aplikacija je uspešno kreirana!
          </p>
          <ul className="list-disc list-inside mt-4 text-gray-600 space-y-2">
            <li>React 18</li>
            <li>React Router DOM</li>
            <li>Axios za API pozive</li>
            <li>Tailwind CSS za stilizovanje</li>
            <li>Lucide React za ikone</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
