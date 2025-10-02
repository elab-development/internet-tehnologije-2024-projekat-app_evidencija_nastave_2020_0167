import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
        const response = await api.get('/admin/users');
        setUsers(response.data.data || []); 
        } catch (error) {
        console.error('Greska:', error);
        } finally {
        setLoading(false);
        }
    };
    fetchUsers();
    }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Admin: {user?.name}</p>

      <Card title="Lista korisnika">
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="p-3 bg-gray-50 rounded">
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="text-xs text-orange-500">{u.role}</p>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
};

export default AdminDashboardPage;