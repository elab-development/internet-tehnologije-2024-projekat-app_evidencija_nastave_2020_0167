import { useState } from 'react';

const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...params) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunc(...params);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Došlo je do greške');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};

export default useApi;