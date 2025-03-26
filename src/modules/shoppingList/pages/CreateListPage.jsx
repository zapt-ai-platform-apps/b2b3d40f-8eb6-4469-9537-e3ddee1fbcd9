import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingList } from '../context/ShoppingListContext';

export default function CreateListPage() {
  const navigate = useNavigate();
  const { createList } = useShoppingList();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Il nome della lista è obbligatorio');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newList = createList({ name, createdAt: new Date().toISOString() });
      navigate(`/lists/${newList.id}`);
    } catch (error) {
      console.error('Error creating list:', error);
      setError('Si è verificato un errore durante la creazione della lista');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Crea nuova lista</h2>
      
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Nome della lista
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Es. Spesa settimanale"
            className="input w-full"
            disabled={isSubmitting}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
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
            {isSubmitting ? 'Creazione...' : 'Crea lista'}
          </button>
        </div>
      </form>
    </div>
  );
}