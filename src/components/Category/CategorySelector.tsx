import React, { useState } from 'react';
import { Category } from '../../types';
import { useApp } from '../../contexts/AppContext';
import CategoryBadge from './CategoryBadge';

interface CategorySelectorProps {
  selectedCategory: string | Category;
  onChange: (categoryId: string) => void;
  className?: string;
}


const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onChange,
  className = ''
}) => {
  const { categories } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedCategoryObj = categories.find(c => c._id === selectedCategory);

  const handleCategorySelect = (categoryId: string) => {
    onChange(categoryId);
    setShowDropdown(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="flex items-center cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedCategoryObj ? (
          <CategoryBadge category={selectedCategoryObj} />
        ) : (
          <div className="ios-tag" style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
            选择分类
          </div>
        )}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="ml-1"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {categories.map((category) => (
              <div
                key={category._id}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleCategorySelect(category._id)}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                ></div>
                {category.name}
                {selectedCategory === category._id && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="ml-auto"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;