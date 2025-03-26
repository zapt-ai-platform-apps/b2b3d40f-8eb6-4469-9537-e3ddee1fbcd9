import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

// Default categories
const DEFAULT_CATEGORIES = [
  { id: 'frutta-verdura', name: 'Frutta e Verdura', icon: '🥦' },
  { id: 'pane-pasta', name: 'Pane e Pasta', icon: '🍞' },
  { id: 'carne-pesce', name: 'Carne e Pesce', icon: '🥩' },
  { id: 'latticini', name: 'Latticini', icon: '🧀' },
  { id: 'surgelati', name: 'Surgelati', icon: '🧊' },
  { id: 'bevande', name: 'Bevande', icon: '🥤' },
  { id: 'casa', name: 'Casa e Pulizia', icon: '🧹' },
  { id: 'altro', name: 'Altro', icon: '📦' }
];

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from localStorage on component mount
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading categories from localStorage:', error);
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('categories', JSON.stringify(categories));
      } catch (error) {
        console.error('Error saving categories to localStorage:', error);
        Sentry.captureException(error);
      }
    }
  }, [categories, isLoading]);

  // Get all categories
  const getAllCategories = () => categories;

  // Get a category by ID
  const getCategory = (categoryId) => {
    return categories.find(category => category.id === categoryId) || null;
  };

  const value = {
    categories,
    isLoading,
    getAllCategories,
    getCategory
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};