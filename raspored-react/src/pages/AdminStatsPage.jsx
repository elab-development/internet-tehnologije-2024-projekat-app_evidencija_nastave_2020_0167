import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminStatsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/attendance/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div>Nema podataka</div>;

  // grafik prisustva po korisnicima
  const attendanceByUser = {
    labels: stats.by_user?.map(u => u.user_name) || [],
    datasets: [
      {
        label: 'Prisustvo',
        data: stats.by_user?.map(u => u.present_count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Odsustvo',
        data: stats.by_user?.map(u => u.absent_count) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      }
    ]
  };

  // ukupno
  const totalStats = {
    labels: ['Prisustvo', 'Odsustvo'],
    datasets: [{
      data: [stats.total_present || 0, stats.total_absent || 0],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }]
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Statistika prisustva</h1>
        <p className="text-gray-600">Analiza prisustva studenata na nastavi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Ukupno evidencija</p>
            <p className="text-4xl font-bold text-blue-600">
              {stats.total_attendance || 0}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Prisutni</p>
            <p className="text-4xl font-bold text-green-600">
              {stats.total_present || 0}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Odsutni</p>
            <p className="text-4xl font-bold text-red-600">
              {stats.total_absent || 0}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Prisustvo po studentima">
          <Bar 
            data={attendanceByUser}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: false }
              }
            }}
          />
        </Card>

        <Card title="Ukupna statistika">
          <div className="flex justify-center">
            <div style={{ width: '300px', height: '300px' }}>
              <Pie 
                data={totalStats}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminStatsPage;