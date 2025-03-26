import React, { useState } from 'react';
import { useShoppingList } from '../context/ShoppingListContext';
import { useCategory } from '@/modules/categories/context/CategoryContext';
import * as Sentry from '@sentry/browser';

export default function ShoppingItemForm({ listId, onAdd, onCancel, initialItem = null }) {
  const { addItem, updateItem } = useShoppingList();
  const { categories } = useCategory();
  
  const [item, setItem] = useState({
    name: initialItem?.name || '',
    quantity: initialItem?.quantity || '1',
    price: initialItem?.price || '',
    category: initialItem?.category || categories[0]?.id || '',
    notes: initialItem?.notes || '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!item.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }
    
    if (item.quantity && isNaN(parseFloat(item.quantity))) {
      newErrors.quantity = 'La quantità deve essere un numero';
    }
    
    if (item.price && isNaN(parseFloat(item.price))) {
      newErrors.price = 'Il prezzo deve essere un numero';
    }
    
    if (!item.category) {
      newErrors.category = 'La categoria è obbligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (initialItem) {
        updateItem(listId, initialItem.id, item);
      } else {
        addItem(listId, item);
      }
      onAdd();
    } catch (error) {
      console.error('Error saving item:', error);
      Sentry.captureException(error);
      alert('Si è verificato un errore durante il salvataggio dell\'articolo');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
          Nome articolo *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={item.name}
          onChange={handleChange}
          className={`input w-full box-border ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Es. Latte"
          disabled={isSubmitting}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">
            Quantità
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={item.quantity}
            onChange={handleChange}
            className={`input w-full box-border ${errors.quantity ? 'border-red-500' : ''}`}
            placeholder="1"
            disabled={isSubmitting}
          />
          {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
            Prezzo (€)
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={item.price}
            onChange={handleChange}
            className={`input w-full box-border ${errors.price ? 'border-red-500' : ''}`}
            placeholder="0.00"
            disabled={isSubmitting}
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
          Categoria *
        </label>
        <select
          id="category"
          name="category"
          value={item.category}
          onChange={handleChange}
          className={`input w-full box-border ${errors.category ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        >
          <option value="">Seleziona categoria</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
          Note
        </label>
        <textarea
          id="notes"
          name="notes"
          value={item.notes}
          onChange={handleChange}
          rows="2"
          className="input w-full box-border"
          placeholder="Note aggiuntive (opzionale)"
          disabled={isSubmitting}
        ></textarea>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary cursor-pointer"
          disabled={isSubmitting}
        >
          Annulla
        </button>
        <button
          type="submit"
          className="btn btn-primary cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvataggio...' : initialItem ? 'Aggiorna' : 'Aggiungi'}
        </button>
      </div>
    </form>
  );
}