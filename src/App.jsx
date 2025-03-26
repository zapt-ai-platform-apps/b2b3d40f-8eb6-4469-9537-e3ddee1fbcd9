import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ShoppingListProvider } from '@/modules/shoppingList/context/ShoppingListContext';
import { CategoryProvider } from '@/modules/categories/context/CategoryContext';
import HomePage from '@/modules/core/pages/HomePage';
import ShoppingListPage from '@/modules/shoppingList/pages/ShoppingListPage';
import CreateListPage from '@/modules/shoppingList/pages/CreateListPage';
import Layout from '@/modules/core/components/Layout';
import NotFoundPage from '@/modules/core/pages/NotFoundPage';
import ZaptBadge from '@/modules/core/components/ZaptBadge';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CategoryProvider>
        <ShoppingListProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lists/new" element={<CreateListPage />} />
              <Route path="/lists/:listId" element={<ShoppingListPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </ShoppingListProvider>
      </CategoryProvider>
      <ZaptBadge />
    </div>
  );
}