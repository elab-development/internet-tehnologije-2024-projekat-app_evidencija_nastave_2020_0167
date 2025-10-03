import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const StudentAttendancePage = () => {
  const [todayClasses, setTodayClasses] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes, attendanceRes] = await Promise.all([
        api.get('/student/attendance/today-classes'),
        api.get('/student/attendance/my-attendance')
      ]);
      
      setTodayClasses(classesRes.data.classes || []);
      setMyAttendance(attendanceRes.data.attendance || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (scheduleId) => {
    try {
            await api.post('/student/attendance/check-in', { 
            schedule_id: scheduleId,
            date: new Date().toISOString().split('T')[0]  
            });
            alert('Prisustvo evidentirano!');
            fetchData();
        } catch (error) {
            alert('Greška: ' + (error.response?.data?.message || 'Već ste evidentirali prisustvo'));
            console.error(error);
        }
    };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Prisustvo</h1>
        <p className="text-gray-600">Evidentiranje prisustva i istorija</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Današnji časovi</h2>
        {todayClasses.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-4">Nemate časova danas</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {todayClasses.map(cls => (
            <Card key={cls.id}>  
                <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg">{cls.subject?.name || 'Bez naziva'}</h3>
                    <p className="text-sm text-gray-600">
                    {cls.start_time} - {cls.end_time} | {cls.classroom}
                    </p>
                </div>
                <Button onClick={() => handleCheckIn(cls.id)}>
                    Evidentiraj prisustvo
                </Button>
                </div>
            </Card>
            ))}
          </div>
        )}
      </div>


      <div>
        <h2 className="text-xl font-bold mb-4">Istorija prisustva</h2>
        {myAttendance.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-4">Nemate evidencija</p>
          </Card>
        ) : (
          <Card>
            <div className="space-y-3">
              {myAttendance.map(att => (
                <div key={att.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{att.schedule?.subject?.name}</p>
                    <p className="text-sm text-gray-600">
                      Datum: {new Date(att.date).toLocaleDateString('sr-RS')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${
                    att.is_present 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {att.is_present ? 'Prisutan' : 'Odsutan'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default StudentAttendancePage;