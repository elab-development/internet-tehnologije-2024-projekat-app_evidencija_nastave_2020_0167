import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Card from './components/common/Card';
import Breadcrumbs from './components/common/Breadcrumbs';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Calendar, Users, BookOpen } from 'lucide-react';

function HomePage() {
  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Pocetna' }]} />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Raspored nastave
          </h2>
          <p className="text-gray-600">
            Pratite svoj raspored i prisustvo na casovima
          </p>
        </div>
        
        <Card title="O Aplikaciji">
          <p className="text-gray-600 mb-4">
            Sistem za evidenciju rasporeda nastave omogucava studentima da 
            prate svoj raspored i prisustvo na casovima.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Pregled licnog rasporeda</li>
            <li>Evidencija prisustva</li>
            <li>Upravljanje profilom</li>
            <li>Export kalendara</li>
          </ul>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="text-orange-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Raspored</h3>
              <p className="text-gray-600 text-sm">
                Pristup rasporedu casova
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="text-pink-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Korisnici</h3>
              <p className="text-gray-600 text-sm">
                Upravljanje studentima
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-orange-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Predmeti</h3>
              <p className="text-gray-600 text-sm">
                Pregled svih predmeta
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <div className="text-center mt-12">
                  <h1 className="text-2xl font-bold">Student Dashboard</h1>
                  <p className="text-gray-600">Uskoro...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <div className="text-center mt-12">
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-gray-600">Uskoro...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;