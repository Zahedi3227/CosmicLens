import { useEffect, useState } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

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
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const removeFavorite = (imageUrl) => {
    const newFavorites = favorites.filter(fav => fav.url !== imageUrl);
    setFavorites(newFavorites);
    localStorage.setItem('nasaFavorites', JSON.stringify(newFavorites));
  };

  const toggleFavorite = (image) => {
    if (isFavorite(image.url)) {
      removeFavorite(image.url);
    } else {
      addFavorite(image);
    }
  };

  const isFavorite = (imageUrl) => favorites.some(fav => fav.url === imageUrl);

  return { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite, 
    toggleFavorite,
    showAnimation 
  };
}; 