import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-3xl flex items-center justify-between">
        <div className="flex items-center">
          {!isHomePage && (
            <Link to="/" className="mr-3">
              <ChevronLeftIcon className="h-6 w-6 text-slate-600" />
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <ShoppingCartIcon className="h-6 w-6 text-sky-400" />
            <h1 className="text-xl font-semibold text-slate-800">Gestisci Spesa</h1>
          </Link>
        </div>
      </div>
    </header>
  );
}