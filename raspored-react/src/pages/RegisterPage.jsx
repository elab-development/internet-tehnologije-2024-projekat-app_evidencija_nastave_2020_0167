import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    student_id: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Ime je obavezno';
    if (!formData.email) newErrors.email = 'Email je obavezan';
    if (!formData.password) newErrors.password = 'Lozinka je obavezna';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(formData);
      navigate('/student');
    } catch (error) {
      setErrors({ api: 'Greška pri registraciji' });
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-pink-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Registracija</h2>
            <p className="text-gray-600 mt-2">Kreirajte novi nalog</p>
          </div>

          {errors.api && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Ime i prezime"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Marko Markovic"
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="marko@student.com"
            />

            <InputField
              label="Broj indeksa"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              placeholder="2020/0167"
            />

            <InputField
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="060123456"
            />

            <InputField
              label="Lozinka"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full">
              Registruj se
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vec imate nalog?{' '}
              <a href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                Prijavite se
              </a>
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;