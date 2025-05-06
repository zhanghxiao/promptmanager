import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useApp } from '../contexts/AppContext';

const CategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, promptGroups } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#007AFF');

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

  const resetForm = () => {
    setCategoryName('');
    setCategoryColor('#007AFF');
    setShowAddForm(false);
    setEditingCategoryId(null);
  };

  const handleAddCategory = () => {
    if (!categoryName.trim()) return;

    addCategory({
      name: categoryName.trim(),
      color: categoryColor
    });

    resetForm();
  };

  const handleUpdateCategory = () => {
    if (!editingCategoryId || !categoryName.trim()) return;

    updateCategory(editingCategoryId, {
      name: categoryName.trim(),
      color: categoryColor
    });

    resetForm();
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    if (category) {
      setCategoryName(category.name);
      setCategoryColor(category.color);
      setEditingCategoryId(categoryId);
      setShowAddForm(false);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    // 检查是否有使用该分类的提示词组
    const usingGroups = promptGroups.filter(group => group.category === categoryId);
    
    if (usingGroups.length > 0) {
      alert(`无法删除此分类，有 ${usingGroups.length} 个提示词组正在使用它。请先修改这些提示词组的分类。`);
      return;
    }
    
    if (window.confirm('确定要删除此分类吗？')) {
      deleteCategory(categoryId);
    }
  };

  const getCategoryUsageCount = (categoryId: string) => {
    return promptGroups.filter(group => group.category === categoryId).length;
  };

  return (
    <Layout title="分类管理">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">分类管理</h2>
        {!showAddForm && !editingCategoryId && (
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
          >
            添加分类
          </Button>
        )}
      </div>

      {(showAddForm || editingCategoryId) && (
        <Card className="mb-4">
          <CardHeader 
            title={editingCategoryId ? "编辑分类" : "添加分类"} 
          />
          <CardContent>
            <div className="space-y-4">
              <Input
                label="分类名称"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="请输入分类名称"
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
                        ${categoryColor === option.color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}
                      `}
                      style={{ backgroundColor: option.color }}
                      onClick={() => setCategoryColor(option.color)}
                      title={option.name}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={resetForm}
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  onClick={editingCategoryId ? handleUpdateCategory : handleAddCategory}
                  disabled={!categoryName.trim()}
                >
                  {editingCategoryId ? '保存' : '添加'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="ios-list">
        {categories.map((category) => (
          <div key={category._id} className="ios-list-item">
            <div 
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: category.color }}
            />
            <div className="ios-list-item-content">
              <div className="ios-list-item-title">{category.name}</div>
              <div className="ios-list-item-subtitle">
                使用次数: {getCategoryUsageCount(category._id)}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-blue-500 p-2"
                onClick={() => handleEditCategory(category._id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                className="text-red-500 p-2"
                onClick={() => handleDeleteCategory(category._id)}
                disabled={getCategoryUsageCount(category._id) > 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default CategoriesPage;