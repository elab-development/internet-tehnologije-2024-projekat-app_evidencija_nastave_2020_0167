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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = user.role === 'admin' ? '/admin/profile' : '/student/profile';
      await api.put(endpoint, { name, phone });
      setMessage('Sacuvano!');
    } catch (err) {
      setMessage('Greska');
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return alert('Izaberi sliku');

    const formData = new FormData();
    formData.append('image', selectedFile);
    setUploading(true);

    try {
      const endpoint = user.role === 'admin' ? '/admin/profile/image' : '/student/profile/image';
      await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Slika postavljena!');
      window.location.reload();
    } catch (error) {
      alert('Greska: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('Obrisati sliku?')) return;

    try {
      const endpoint = user.role === 'admin' ? '/admin/profile/image' : '/student/profile/image';
      await api.delete(endpoint);
      alert('Slika obrisana!');
      window.location.reload();
    } catch (error) {
      alert('Greska');
    }
  };

  return (
    <Layout>
      <Card>
        {user?.profile_image && (
          <div className="flex justify-center mb-6">
            <img 
              src={`http://127.0.0.1:8000/storage/${user.profile_image}`}
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-200"
            />
          </div>
        )}
        <h2 className="text-2xl font-bold mb-4">{user?.name}</h2>
        <p className="text-gray-600 mb-6">{user?.email}</p>

        {/* upload slike */}
        <div className="mb-6 pb-6 border-b">
          <h3 className="font-semibold mb-3">Profilna slika</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button onClick={handleUploadImage} disabled={uploading || !selectedFile}>
              {uploading ? 'Upload...' : 'Postavi sliku'}
            </Button>
            <Button onClick={handleDeleteImage} className="bg-red-500 hover:bg-red-600">
              Obriši sliku
            </Button>
          </div>
        </div>

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