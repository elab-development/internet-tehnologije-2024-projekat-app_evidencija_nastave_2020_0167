import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const AdminSubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    semester: ''
  });

  useEffect(() => {
    fetchSubjects();
  }, [searchTerm, semesterFilter]);

  const fetchSubjects = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (semesterFilter) params.semester = semesterFilter;
      
      const response = await api.get('/admin/subjects', { params });
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/subjects', formData);
      alert('Predmet uspešno dodat!');
      setShowModal(false);
      setFormData({ name: '', code: '', credits: '', semester: '' });
      fetchSubjects();
    } catch (error) {
      alert('Greška: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Da li ste sigurni?')) return;
    
    try {
      await api.delete(`/admin/subjects/${subjectId}`);
      alert('Predmet obrisan!');
      fetchSubjects();
    } catch (error) {
      alert('Greška: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Upravljanje predmetima</h1>
        <p className="text-gray-600">Dodajte, pregledajte ili obrišite predmete</p>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Pretraži po nazivu ili šifri..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="px-4 py-2 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[150px]"
        >
          <option value="">Svi semestri</option>
          <option value="1">Semestar 1</option>
          <option value="2">Semestar 2</option>
          <option value="3">Semestar 3</option>
          <option value="4">Semestar 4</option>
          <option value="5">Semestar 5</option>
          <option value="6">Semestar 6</option>
          <option value="7">Semestar 7</option>
          <option value="8">Semestar 8</option>
        </select>

        <Button onClick={() => setShowModal(true)}>
          Dodaj predmet
        </Button>
      </div>

      <Card>
        <div className="space-y-3">
          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Nema predmeta</p>
            </div>
          ) : (
            subjects.map(subject => (
              <div key={subject.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{subject.name}</p>
                  <p className="text-sm text-gray-600">Šifra: {subject.code}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Semestar {subject.semester}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {subject.credits} ESPB
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Obriši
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Dodaj novi predmet">
          <form onSubmit={handleAddSubject} className="space-y-4">
            <InputField
              label="Naziv predmeta"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <InputField
              label="Šifra predmeta"
              required
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
            
            <InputField
              label="ESPB bodovi"
              type="number"
              required
              min="1"
              max="15"
              value={formData.credits}
              onChange={(e) => setFormData({...formData, credits: e.target.value})}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Semestar</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Izaberi semestar</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Dodaj predmet</Button>
              <Button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="bg-gray-500 hover:bg-gray-600"
              >
                Otkaži
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default AdminSubjectsPage;