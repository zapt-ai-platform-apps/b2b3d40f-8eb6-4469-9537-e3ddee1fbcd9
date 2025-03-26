import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusIcon, ShoppingCartIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useShoppingList } from '../context/ShoppingListContext';
import { useCategory } from '@/modules/categories/context/CategoryContext';
import ShoppingItemForm from '../components/ShoppingItemForm';
import ShoppingItemsList from '../components/ShoppingItemsList';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '@/modules/core/components/EmptyState';
import * as Sentry from '@sentry/browser';

export default function ShoppingListPage() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { getList, updateList, markListCompleted, calculateListTotal } = useShoppingList();
  const { categories } = useCategory();
  
  const [list, setList] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate totals
  const totalAmount = list ? calculateListTotal(list.id) : 0;
  const completedItems = list?.items.filter(item => item.isPurchased).length || 0;
  const totalItems = list?.items.length || 0;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Load the shopping list
  useEffect(() => {
    try {
      const shoppingList = getList(listId);
      if (!shoppingList) {
        setError('Lista non trovata');
        return;
      }
      setList(shoppingList);
    } catch (error) {
      console.error('Error loading shopping list:', error);
      Sentry.captureException(error);
      setError('Errore durante il caricamento della lista');
    } finally {
      setLoading(false);
    }
  }, [listId, getList]);

  // Keep list in sync with context updates
  useEffect(() => {
    if (!loading) {
      const updatedList = getList(listId);
      setList(updatedList);
    }
  }, [listId, getList, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <ArrowPathIcon className="h-8 w-8 text-sky-400 animate-spin" />
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || 'Lista non trovata'}</p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary cursor-pointer"
        >
          Torna alla home
        </button>
      </div>
    );
  }

  const toggleListCompleted = () => {
    markListCompleted(listId, !list.isCompleted);
  };

  const handleAddItemClick = () => {
    setIsAddingItem(true);
  };

  const handleCancelAddItem = () => {
    setIsAddingItem(false);
  };

  const handleAddItem = () => {
    setIsAddingItem(false);
  };

  const filteredItems = selectedCategory === 'all'
    ? list.items
    : list.items.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-2xl font-bold text-slate-800">{list.name}</h2>
          <button
            onClick={toggleListCompleted}
            className={`btn ${list.isCompleted ? 'btn-secondary' : 'btn-primary'} cursor-pointer`}
          >
            {list.isCompleted ? 'Riapri lista' : 'Completa lista'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-500 mb-1">Totale stimato</p>
            <p className="text-xl font-semibold text-slate-800">€ {totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-500 mb-1">Articoli</p>
            <p className="text-xl font-semibold text-slate-800">{completedItems} / {totalItems}</p>
          </div>
        </div>
        
        {totalItems > 0 && (
          <div className="relative h-2 bg-slate-200 rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-sky-400 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800">Articoli</h3>
        {!isAddingItem && (
          <button 
            onClick={handleAddItemClick}
            className="btn btn-primary flex items-center gap-2 cursor-pointer"
            disabled={list.isCompleted}
          >
            <PlusIcon className="h-5 w-5" />
            Aggiungi
          </button>
        )}
      </div>

      {isAddingItem && (
        <ShoppingItemForm
          listId={listId}
          onAdd={handleAddItem}
          onCancel={handleCancelAddItem}
        />
      )}

      {categories.length > 0 && totalItems > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {totalItems === 0 ? (
        <EmptyState
          title="Nessun articolo nella lista"
          description="Aggiungi articoli per iniziare a fare la spesa"
          icon={ShoppingCartIcon}
          action={
            <button 
              onClick={handleAddItemClick}
              className="btn btn-primary flex items-center gap-2 cursor-pointer"
              disabled={list.isCompleted}
            >
              <PlusIcon className="h-5 w-5" />
              Aggiungi articolo
            </button>
          }
        />
      ) : filteredItems.length === 0 ? (
        <p className="text-center text-slate-500 py-6">
          Nessun articolo in questa categoria
        </p>
      ) : (
        <ShoppingItemsList
          items={filteredItems}
          listId={listId}
          isCompleted={list.isCompleted}
        />
      )}
    </div>
  );
}