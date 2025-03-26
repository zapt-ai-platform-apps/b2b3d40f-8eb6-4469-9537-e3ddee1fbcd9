import React from 'react';

export default function ZaptBadge() {
  return (
    <a 
      href="https://www.zapt.ai" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 bg-white rounded-full shadow-md px-3 py-1 text-xs font-medium text-slate-600 flex items-center hover:bg-slate-50 transition-colors"
    >
      Made on ZAPT
    </a>
  );
}