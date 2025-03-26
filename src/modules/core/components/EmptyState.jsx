import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function EmptyState({ title, description, action, icon: Icon = ShoppingBagIcon }) {
  return (
    <div className="card flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-slate-100 rounded-full p-4 mb-4">
        <Icon className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}