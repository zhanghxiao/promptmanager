import React from 'react';
import { Category } from '../../types';

interface CategoryBadgeProps {
  category: Category;
  onClick?: () => void;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  onClick,
  className = ''
}) => {
  return (
    <div
      className={`ios-tag cursor-pointer ${className}`}
      style={{ backgroundColor: `${category.color}20`, color: category.color }}
      onClick={onClick}
    >
      {category.name}
    </div>
  );
};

export default CategoryBadge;