import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritesContextType } from '../types';
import { useAuthUser } from './authStore';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = 'user_favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthUser();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      if (!user) {
        setFavorites([]);
        return;
      }

      const key = `${FAVORITES_KEY}_${user.uid}`;
      const favoritesJson = await AsyncStorage.getItem(key);
      if (favoritesJson) {
        setFavorites(JSON.parse(favoritesJson));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }

    try {
      let newFavorites: string[];
      if (favorites.includes(propertyId)) {
        // Remove from favorites
        newFavorites = favorites.filter(id => id !== propertyId);
      } else {
        // Add to favorites
        newFavorites = [...favorites, propertyId];
      }

      setFavorites(newFavorites);
      
      // Save to AsyncStorage
      const key = `${FAVORITES_KEY}_${user.uid}`;
      await AsyncStorage.setItem(key, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      loadFavorites();
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};