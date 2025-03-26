import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import ShoppingListCard from '@/modules/shoppingList/components/ShoppingListCard';
import { useShoppingList } from '@/modules/shoppingList/context/ShoppingListContext';
import EmptyState from '@/modules/core/components/EmptyState';

export default function HomePage() {
  const { shoppingLists } = useShoppingList();
  
  const activeLists = shoppingLists.filter(list => !list.isCompleted);
  const completedLists = shoppingLists.filter(list => list.isCompleted);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Le tue liste</h2>
        <Link 
          to="/lists/new" 
          className="btn btn-primary flex items-center gap-2 cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nuova lista</span>
        </Link>
      </div>

      {shoppingLists.length === 0 ? (
        <EmptyState 
          title="Nessuna lista della spesa"
          description="Crea la tua prima lista della spesa per iniziare"
          action={
            <Link to="/lists/new" className="btn btn-primary flex items-center gap-2 cursor-pointer">
              <PlusIcon className="h-5 w-5" />
              <span>Nuova lista</span>
            </Link>
          }
        />
      ) : (
        <>
          {activeLists.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Liste attive</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {activeLists.map(list => (
                  <ShoppingListCard key={list.id} list={list} />
                ))}
              </div>
            </section>
          )}

          {completedLists.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Liste completate</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {completedLists.map(list => (
                  <ShoppingListCard key={list.id} list={list} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}