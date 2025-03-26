import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/browser';

const ShoppingListContext = createContext();

export function ShoppingListProvider({ children }) {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load shopping lists from localStorage on component mount
  useEffect(() => {
    try {
      const savedLists = localStorage.getItem('shoppingLists');
      if (savedLists) {
        setShoppingLists(JSON.parse(savedLists));
      }
    } catch (error) {
      console.error('Error loading shopping lists from localStorage:', error);
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save shopping lists to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('shoppingLists', JSON.stringify(shoppingLists));
      } catch (error) {
        console.error('Error saving shopping lists to localStorage:', error);
        Sentry.captureException(error);
      }
    }
  }, [shoppingLists, isLoading]);

  // Create a new shopping list
  const createList = (listData) => {
    const newList = {
      id: uuidv4(),
      items: [],
      isCompleted: false,
      createdAt: new Date().toISOString(),
      ...listData
    };
    
    setShoppingLists(prevLists => [newList, ...prevLists]);
    return newList;
  };

  // Get a specific shopping list by ID
  const getList = (listId) => {
    return shoppingLists.find(list => list.id === listId) || null;
  };

  // Update a shopping list
  const updateList = (listId, updates) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => 
        list.id === listId ? { ...list, ...updates } : list
      )
    );
  };

  // Delete a shopping list
  const deleteList = (listId) => {
    setShoppingLists(prevLists => 
      prevLists.filter(list => list.id !== listId)
    );
  };

  // Add an item to a shopping list
  const addItem = (listId, item) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: [...list.items, { id: uuidv4(), isPurchased: false, ...item }]
          };
        }
        return list;
      })
    );
  };

  // Update an item in a shopping list
  const updateItem = (listId, itemId, updates) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            )
          };
        }
        return list;
      })
    );
  };

  // Delete an item from a shopping list
  const deleteItem = (listId, itemId) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter(item => item.id !== itemId)
          };
        }
        return list;
      })
    );
  };

  // Toggle item purchased status
  const toggleItemPurchased = (listId, itemId) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map(item => 
              item.id === itemId ? { ...item, isPurchased: !item.isPurchased } : item
            )
          };
        }
        return list;
      })
    );
  };

  // Mark a shopping list as completed
  const markListCompleted = (listId, isCompleted = true) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => 
        list.id === listId ? { ...list, isCompleted } : list
      )
    );
  };

  // Calculate the total estimated cost of a shopping list
  const calculateListTotal = (listId) => {
    const list = getList(listId);
    if (!list) return 0;
    
    return list.items.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseFloat(item.quantity) || 1;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const value = {
    shoppingLists,
    isLoading,
    createList,
    getList,
    updateList,
    deleteList,
    addItem,
    updateItem,
    deleteItem,
    toggleItemPurchased,
    markListCompleted,
    calculateListTotal
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};