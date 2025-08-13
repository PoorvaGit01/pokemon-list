import { useState, useEffect, useCallback } from 'react';
import type { FavoritesPersistence } from '../types/pokemon.ts';

const FAVORITES_KEY = 'pokemon-favorites';

export const useFavorites = (): FavoritesPersistence => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const favArray = JSON.parse(stored) as number[];
        setFavorites(new Set(favArray));
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever favorites change
  const saveFavorites = useCallback((newFavorites: Set<number>) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }, []);

  const addFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev).add(id);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const removeFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.delete(id);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const isFavorite = useCallback((id: number) => favorites.has(id), [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
};