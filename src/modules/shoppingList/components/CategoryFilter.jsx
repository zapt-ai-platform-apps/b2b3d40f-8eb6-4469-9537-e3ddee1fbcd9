import React from 'react';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2">
        <button
          onClick={() => onSelectCategory('all')}
          className={`btn ${
            selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'
          } whitespace-nowrap cursor-pointer`}
        >
          Tutti
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`btn ${
              selectedCategory === category.id ? 'btn-primary' : 'btn-secondary'
            } whitespace-nowrap flex items-center gap-1 cursor-pointer`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}