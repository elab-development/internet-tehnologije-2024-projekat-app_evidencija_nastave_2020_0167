import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Card from './components/common/Card';
import Breadcrumbs from './components/common/Breadcrumbs';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSubjectsPage from './pages/AdminSubjectsPage';
//import { Calendar, Users, BookOpen } from 'lucide-react';

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
              <StudentDashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/subjects" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSubjectsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;