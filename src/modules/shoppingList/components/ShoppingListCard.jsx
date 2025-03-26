import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useShoppingList } from '../context/ShoppingListContext';

export default function ShoppingListCard({ list }) {
  const { deleteList, calculateListTotal } = useShoppingList();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Sei sicuro di voler eliminare questa lista?')) {
      deleteList(list.id);
    }
  };

  const totalItems = list.items.length;
  const purchasedItems = list.items.filter(item => item.isPurchased).length;
  const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;
  const total = calculateListTotal(list.id).toFixed(2);
  
  const formattedDate = new Date(list.createdAt).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Link to={`/lists/${list.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="h-5 w-5 text-sky-400" />
            <h3 className="font-semibold text-slate-800 text-lg truncate">{list.name}</h3>
          </div>
          {list.isCompleted && (
            <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
          )}
        </div>
        
        <div className="flex justify-between text-sm text-slate-500 mb-3">
          <span>{formattedDate}</span>
          <span>{purchasedItems}/{totalItems} articoli</span>
        </div>
        
        {totalItems > 0 && (
          <div className="relative h-2 bg-slate-200 rounded-full mb-3">
            <div 
              className="absolute top-0 left-0 h-full bg-sky-400 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-700">€ {total}</span>
          <button 
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
            aria-label="Elimina lista"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}