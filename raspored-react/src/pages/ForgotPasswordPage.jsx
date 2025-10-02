import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/password/reset-request', { email });
      setMessage('Link za reset lozinke poslat na email!');
    } catch (error) {
      setMessage('Greška');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Zaboravljena lozinka</h2>
        {message && <p className="mb-4 text-green-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <InputField 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Button type="submit">Pošalji link</Button>
        </form>
        <Link to="/login" className="text-orange-600 text-sm mt-4 block">
          Nazad na login
        </Link>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;