import React, { useState } from 'react';
// eslint-disable-next-line
import { PromptGroup } from '../../types';
import PromptGroupCard from './PromptGroupCard';
import { useApp } from '../../contexts/AppContext';
import CategorySelector from '../Category/CategorySelector';
import Input from '../common/Input';

const PromptGroupList: React.FC = () => {
  // eslint-disable-next-line
  const { promptGroups, categories } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // 搜索和过滤提示词组
  const filteredPromptGroups = promptGroups.filter((group) => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === '' || group.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="搜索提示词组..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-1"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          }
        />
        <div className="flex gap-2">
          <CategorySelector
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
          {(searchTerm || selectedCategory) && (
            <button 
              className="ios-navbar-button" 
              onClick={resetFilters}
            >
              清除筛选
            </button>
          )}
        </div>
      </div>

      {filteredPromptGroups.length === 0 ? (
        <div className="ios-empty-state">
          <div className="ios-empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 className="ios-empty-state-title">未找到提示词组</h3>
          <p className="ios-empty-state-text">
            {searchTerm || selectedCategory 
              ? '请尝试调整筛选条件' 
              : '点击底部的"新建"按钮创建您的第一个提示词组'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPromptGroups.map((group) => (
            <PromptGroupCard 
              key={group._id} 
              promptGroup={group} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptGroupList;