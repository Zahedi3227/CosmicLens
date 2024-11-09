import { useEffect, useState } from 'react';
import { fetchAPODData } from '../services/nasaApi';
import { useFavorites } from './useFavorites';

export const useNasaAPOD = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apodData, setApodData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const addToHistory = (data) => {
    const history = JSON.parse(localStorage.getItem('nasaHistory') || '[]');
    const exists = history.some(item => item.date === data.date);
    
    if (!exists) {
      const newHistory = [data, ...history].slice(0, 50);
      localStorage.setItem('nasaHistory', JSON.stringify(newHistory));
    }
  };

  const toggleFavorite = (data) => {
    if (isFavorite(data.url)) {
      removeFavorite(data.url);
    } else {
      addFavorite(data);
    }
  };

  const fetchAPOD = async (date = null) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchAPODData(date);
      setApodData(data);
      setSelectedDate(date || data.date);
      addToHistory(data);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD(selectedDate);
  }, []);

  return {
    loading,
    error,
    apodData,
    selectedDate,
    setSelectedDate,
    fetchAPOD,
    toggleFavorite,
    isFavorite,
    favorites
  };
}; 