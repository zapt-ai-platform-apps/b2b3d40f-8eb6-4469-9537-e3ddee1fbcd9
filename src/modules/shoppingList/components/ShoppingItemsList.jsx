import React, { useState } from 'react';
import { useShoppingList } from '../context/ShoppingListContext';
import { useCategory } from '@/modules/categories/context/CategoryContext';
import ShoppingItemForm from './ShoppingItemForm';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ShoppingItemsList({ items, listId, isCompleted }) {
  const { toggleItemPurchased, deleteItem } = useShoppingList();
  const { getCategory } = useCategory();
  const [editingItemId, setEditingItemId] = useState(null);

  const handleToggleItem = (itemId) => {
    if (!isCompleted) {
      toggleItemPurchased(listId, itemId);
    }
  };

  const handleEditItem = (itemId) => {
    setEditingItemId(itemId);
  };

  const handleUpdateItem = () => {
    setEditingItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo articolo?')) {
      deleteItem(listId, itemId);
    }
  };

  const getCategoryInfo = (categoryId) => {
    return getCategory(categoryId) || { name: 'Categoria', icon: '📦' };
  };

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const categoryId = item.category;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(itemsByCategory).map(([categoryId, categoryItems]) => {
        const category = getCategoryInfo(categoryId);
        
        return (
          <div key={categoryId} className="space-y-2">
            <h4 className="text-md font-medium text-slate-700 flex items-center gap-2">
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </h4>
            
            <div className="space-y-2">
              {categoryItems.map(item => (
                <React.Fragment key={item.id}>
                  {editingItemId === item.id ? (
                    <ShoppingItemForm
                      listId={listId}
                      initialItem={item}
                      onAdd={handleUpdateItem}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <div className="card py-3 flex items-center">
                      <div 
                        className={`flex-1 flex items-start gap-3 ${item.isPurchased ? 'opacity-60' : ''}`}
                        onClick={() => handleToggleItem(item.id)}
                      >
                        <div className="cursor-pointer flex-shrink-0 mt-0.5">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.isPurchased ? 'border-sky-400 bg-sky-400' : 'border-slate-300'}`}>
                            {item.isPurchased && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 cursor-pointer">
                          <p className={`font-medium text-slate-800 ${item.isPurchased ? 'line-through' : ''}`}>
                            {item.name}
                          </p>
                          
                          <div className="flex items-center text-sm text-slate-500 mt-1">
                            <span className="mr-3">
                              {item.quantity && `${item.quantity}x`}
                            </span>
                            {item.price && (
                              <span>€ {parseFloat(item.price).toFixed(2)}</span>
                            )}
                          </div>
                          
                          {item.notes && (
                            <p className="text-sm text-slate-500 mt-1">{item.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      {!isCompleted && (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleEditItem(item.id)}
                            className="p-2 text-slate-400 hover:text-sky-500 cursor-pointer"
                            aria-label="Modifica articolo"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                            aria-label="Elimina articolo"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}