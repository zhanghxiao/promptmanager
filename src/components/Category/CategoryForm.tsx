import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { Category } from '../../types';

interface CategoryFormProps {
  initialCategory?: Partial<Category>;
  onSubmit: (category: Omit<Category, '_id'>) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialCategory = {},
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState(initialCategory.name || '');
  const [color, setColor] = useState(initialCategory.color || '#007AFF');
  const [error, setError] = useState('');

  const colorOptions = [
    { color: '#007AFF', name: '蓝色' },
    { color: '#4CD964', name: '绿色' },
    { color: '#FF3B30', name: '红色' },
    { color: '#FF9500', name: '橙色' },
    { color: '#FFCC00', name: '黄色' },
    { color: '#5856D6', name: '紫色' },
    { color: '#FF2D55', name: '粉色' },
    { color: '#5AC8FA', name: '浅蓝色' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('请输入分类名称');
      return;
    }
    
    onSubmit({
      name: name.trim(),
      color
    });
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="分类名称"
        placeholder="输入分类名称"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError('');
        }}
        error={error}
        required
      />
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          颜色
        </label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((option) => (
            <div 
              key={option.color}
              className={`
                w-8 h-8 rounded-full cursor-pointer
                ${color === option.color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}
              `}
              style={{ backgroundColor: option.color }}
              onClick={() => setColor(option.color)}
              title={option.name}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          取消
        </Button>
        <Button
          variant="primary"
          type="submit"
        >
          保存
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;