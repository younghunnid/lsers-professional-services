
import React, { useState } from 'react';
import { ServiceCategory } from '../types';
import { SERVICE_CATEGORIES } from '../constants';

interface CategoryGridProps {
  onSelect: (c: ServiceCategory) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelect }) => {
  const [activeGroup, setActiveGroup] = useState<string>('all');
  
  const groups = ['all', 'home', 'tech', 'creative', 'professional', 'transport', 'personal', 'food'];

  const filteredCategories = activeGroup === 'all' 
    ? SERVICE_CATEGORIES 
    : SERVICE_CATEGORIES.filter(c => c.group === activeGroup);

  return (
    <div className="space-y-8">
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {groups.map(group => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              activeGroup === group 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            {group.charAt(0).toUpperCase() + group.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredCategories.map(category => (
          <div
            key={category.id}
            onClick={() => onSelect(category)}
            className="group relative bg-white p-6 rounded-3xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-indigo-200 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform duration-500 group-hover:scale-150 group-hover:rotate-12">
              <span className="text-6xl">{category.icon}</span>
            </div>
            
            <div className="text-4xl mb-4 transform transition-transform group-hover:scale-110">{category.icon}</div>
            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{category.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
