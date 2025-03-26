import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ExclamationTriangleIcon className="h-16 w-16 text-amber-500 mb-4" />
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Pagina non trovata</h1>
      <p className="text-slate-600 mb-6">La pagina che stai cercando non esiste.</p>
      <Link to="/" className="btn btn-primary cursor-pointer">
        Torna alla home
      </Link>
    </div>
  );
}