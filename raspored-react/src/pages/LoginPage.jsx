import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email) newErrors.email = 'Email je obavezan';
    if (!password) newErrors.password = 'Lozinka je obavezna';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(email, password);
      navigate('/student');
    } catch (error) {
      setErrors({ api: 'Pogrešan email ili lozinka' });
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-orange-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Prijava</h2>
            <p className="text-gray-600 mt-2">Ulogujte se na svoj nalog</p>
          </div>

          {errors.api && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="vas@email.com"
            />

            <InputField
              label="Lozinka"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full">
              Prijavi se
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nemate nalog?{' '}
              <a href="/register" className="text-orange-600 hover:text-orange-700 font-medium">
                Registrujte se
              </a>
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;