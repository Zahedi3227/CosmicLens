import { useEffect, useState } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('nasaFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const addFavorite = (image) => {
    const newFavorites = [...favorites, { ...image, savedAt: new Date().toISOString() }];
    setFavorites(newFavorites);
    localStorage.setItem('nasaFavorites', JSON.stringify(newFavorites));
  };

  const removeFavorite = (imageUrl) => {
    const newFavorites = favorites.filter(fav => fav.url !== imageUrl);
    setFavorites(newFavorites);
    localStorage.setItem('nasaFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (imageUrl) => favorites.some(fav => fav.url === imageUrl);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}; 