import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import api from '../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Sacuvano!');
    try {
      await api.put('/student/profile', { name, phone });
      setMessage('Sacuvano!');
    } catch (err) {
      setMessage('Greska');
    }
  };

  return (
    <Layout>
      <Card>
        <h2 className="text-2xl font-bold mb-4">{user?.name}</h2>
        <p className="text-gray-600 mb-6">{user?.email}</p>

        {message && <div className="mb-4 text-green-600">{message}</div>}

        <form onSubmit={handleSubmit}>
          <InputField label="Ime" value={name} onChange={(e) => setName(e.target.value)} />
          <InputField label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button type="submit">Sacuvaj</Button>
        </form>
      </Card>
    </Layout>
  );
};

export default ProfilePage;