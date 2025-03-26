import React from 'react';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        {children}
      </main>
    </div>
  );
}