import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    student_id: '',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      
      const response = await api.get('/admin/users', { params });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', formData);
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        student_id: '',
        phone: ''
      });
      fetchUsers();
    } catch (error) {
      alert('Greška pri dodavanju korisnika');
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Da li ste sigurni?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      alert('Greška pri brisanju korisnika');
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Upravljanje korisnicima</h1>
        <p className="text-gray-600">Dodajte, pregledajte ili obrišite korisnike</p>
      </div>

      <div className="mb-6 flex gap-4">
        <InputField
          placeholder="Pretraži korisnike..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Sve role</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="guest">Guest</option>
        </select>

        <Button onClick={() => setShowModal(true)}>
          Dodaj korisnika
        </Button>
      </div>

      <Card>
        <div className="space-y-3">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nema korisnika</p>
          ) : (
            users.map(user => (
              <div key={user.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.student_id && (
                    <p className="text-xs text-gray-500">ID: {user.student_id}</p>
                  )}
                  <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'student' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={user.role === 'admin'}
                >
                  Obriši
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="Dodaj novog korisnika">
          <form onSubmit={handleAddUser} className="space-y-4">
            <InputField
              label="Ime"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <InputField
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            <InputField
              label="Lozinka"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Rola</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="student">Student</option>
                <option value="guest">Guest</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {formData.role === 'student' && (
              <InputField
                label="Broj indeksa"
                required
                value={formData.student_id}
                onChange={(e) => setFormData({...formData, student_id: e.target.value})}
              />
            )}

            <InputField
              label="Telefon"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />

            <div className="flex gap-2">
              <Button type="submit">Dodaj</Button>
              <Button type="button" onClick={() => setShowModal(false)} className="bg-gray-500">
                Otkaži
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default AdminUsersPage;