import React, { useState } from 'react';
import { PromptGroup } from '../../types';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import CategorySelector from '../Category/CategorySelector';
import { useApp } from '../../contexts/AppContext';

interface PromptGroupFormProps {
  initialPromptGroup?: Partial<PromptGroup>;
  onSubmit: (promptGroup: { name: string; description: string; category: string }) => void;
  onCancel: () => void;
}

const PromptGroupForm: React.FC<PromptGroupFormProps> = ({
  initialPromptGroup = {},
  onSubmit,
  onCancel
}) => {
  const { categories } = useApp();
  const [name, setName] = useState(initialPromptGroup.name || '');
  const [description, setDescription] = useState(initialPromptGroup.description || '');
  const [category, setCategory] = useState(initialPromptGroup.category || (categories.length > 0 ? categories[0]._id : ''));
  const [errors, setErrors] = useState({
    name: '',
    category: ''
  });

  const validate = (): boolean => {
    const newErrors = {
      name: '',
      category: ''
    };
    
    if (!name.trim()) {
      newErrors.name = '请输入提示词组名称';
    }
    
    if (!category) {
      newErrors.category = '请选择分类';
    }
    
    setErrors(newErrors);
    
    return !newErrors.name && !newErrors.category;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // 确保 category 是字符串类型
    const categoryId = typeof category === 'object' ? category._id : category;
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category: categoryId
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    setCategory(categoryId);
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="名称"
        placeholder="输入提示词组名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />
      
      <TextArea
        label="描述"
        placeholder="输入提示词组描述..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          分类 {errors.category && <span className="text-red-600">({errors.category})</span>}
        </label>
        <CategorySelector
          selectedCategory={category}
          onChange={handleCategoryChange}
        />
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          取消
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          保存
        </Button>
      </div>
    </form>
  );
};

export default PromptGroupForm;