import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        const fetchSchedule = async () => {
        try {
        const response = await api.get('/student/schedule');
        console.log('Schedule response:', response.data);
        setSchedule(response.data.schedules || []);
        } catch (error) {
        console.error('Greska:', error.response || error);
        } finally {
        setLoading(false);
        }
    };

    fetchSchedule();
    }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Student: {user?.name}!</h1>

      <div className="space-y-4">
        {schedule.map(item => (
          <Card key={item.id}>
            <h3 className="font-bold">{item.subject?.name}</h3>
            <p className="text-gray-600">
              {item.start_time} - {item.end_time} | {item.classroom}
            </p>
          </Card>
        ))}

        {schedule.length === 0 && (
          <Card><p className="text-center">Nemas casova</p></Card>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboardPage;