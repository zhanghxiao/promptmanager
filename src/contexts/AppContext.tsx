import React, { createContext, useContext, useState, useEffect } from 'react';
import { PromptGroup, Category } from '../types';
import { promptGroupAPI, categoryAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface AppContextType {
  promptGroups: PromptGroup[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchPromptGroups: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addPromptGroup: (promptGroup: { name: string; description: string; category: string }) => Promise<PromptGroup>;
  updatePromptGroup: (id: string, promptGroup: { name: string; description: string; category: string }) => Promise<void>;
  deletePromptGroup: (id: string) => Promise<void>;
  addPrompt: (groupId: string, prompt: { title: string; content: string; tags: string[] }) => Promise<void>;
  updatePrompt: (groupId: string, promptId: string, prompt: { title: string; content: string; tags: string[] }) => Promise<void>;
  deletePrompt: (groupId: string, promptId: string) => Promise<void>;
  addDslFile: (groupId: string, dslFile: { name: string; content?: string; fileData?: string; mimeType?: string }) => Promise<void>;
  updateDslFile: (groupId: string, fileId: string, dslFile: { name?: string; content?: string }) => Promise<void>;
  deleteDslFile: (groupId: string, fileId: string) => Promise<void>;
  addCategory: (category: { name: string; color: string }) => Promise<void>;
  updateCategory: (id: string, category: { name: string; color: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promptGroups, setPromptGroups] = useState<PromptGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // 初始加载数据 - 只有在用户已经认证后才加载
  useEffect(() => {
    const loadInitialData = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          await Promise.all([fetchPromptGroups(), fetchCategories()]);
        } catch (err: any) {
          setError(err.message || '加载数据失败');
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
    // eslint-disable-next-line
  }, [isAuthenticated]); // 添加 isAuthenticated 作为依赖项

  // 获取所有提示词组
  const fetchPromptGroups = async () => {
    if (!isAuthenticated) return; // 如果未认证，直接返回
    
    try {
      const data = await promptGroupAPI.getAll();
      setPromptGroups(data);
    } catch (err: any) {
      setError(err.message || '获取提示词组失败');
      throw err;
    }
  };

  // 获取所有分类
  const fetchCategories = async () => {
    if (!isAuthenticated) return; // 如果未认证，直接返回
    
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || '获取分类失败');
      throw err;
    }
  };

  // 添加提示词组
  const addPromptGroup = async (promptGroupData: Omit<PromptGroup, '_id' | 'createdAt' | 'updatedAt' | 'prompts' | 'workflows' | 'dslFiles'>) => {
    try {
      // 确保 category 始终是字符串类型
      const categoryId = typeof promptGroupData.category === 'object' 
        ? promptGroupData.category._id 
        : promptGroupData.category;
        
      const newPromptGroup = await promptGroupAPI.create({
        name: promptGroupData.name,
        description: promptGroupData.description,
        category: categoryId
      });
      
      setPromptGroups(prev => [...prev, newPromptGroup]);
      return newPromptGroup;
    } catch (err: any) {
      setError(err.message || '添加提示词组失败');
      throw err;
    }
  };

  // 更新提示词组
  const updatePromptGroup = async (id: string, promptGroupData: Omit<PromptGroup, '_id' | 'createdAt' | 'updatedAt' | 'prompts' | 'workflows' | 'dslFiles'>) => {
    try {
      // 确保 category 始终是字符串类型
      const categoryId = typeof promptGroupData.category === 'object' 
        ? promptGroupData.category._id 
        : promptGroupData.category;
        
      await promptGroupAPI.update(id, {
        name: promptGroupData.name,
        description: promptGroupData.description,
        category: categoryId
      });
      
      await fetchPromptGroups(); // 重新获取最新数据
    } catch (err: any) {
      setError(err.message || '更新提示词组失败');
      throw err;
    }
  };

  // 删除提示词组
  const deletePromptGroup = async (id: string) => {
    try {
      await promptGroupAPI.delete(id);
      setPromptGroups(prev => prev.filter(group => group._id !== id));
    } catch (err: any) {
      setError(err.message || '删除提示词组失败');
      throw err;
    }
  };

  // 添加提示词
  const addPrompt = async (groupId: string, promptData: { title: string; content: string; tags: string[] }) => {
    try {
      await promptGroupAPI.addPrompt(groupId, promptData);
      await fetchPromptGroups(); // 重新获取最新数据
    } catch (err: any) {
      setError(err.message || '添加提示词失败');
      throw err;
    }
  };
  
  // 更新提示词
  const updatePrompt = async (groupId: string, promptId: string, promptData: { title: string; content: string; tags: string[] }) => {
    try {
      await promptGroupAPI.updatePrompt(groupId, promptId, promptData);
      await fetchPromptGroups(); // 重新获取最新数据
    } catch (err: any) {
      setError(err.message || '更新提示词失败');
      throw err;
    }
  };

  // 删除提示词
  const deletePrompt = async (groupId: string, promptId: string) => {
    try {
      await promptGroupAPI.deletePrompt(groupId, promptId);
      await fetchPromptGroups(); // 重新获取最新数据
    } catch (err: any) {
      setError(err.message || '删除提示词失败');
      throw err;
    }
  };

  // 添加DSL文件 - 修改为支持文本内容
  const addDslFile = async (groupId: string, dslFileData: { name: string; content?: string; fileData?: string; mimeType?: string }) => {
    try {
      await promptGroupAPI.addDslFile(groupId, dslFileData);
      await fetchPromptGroups(); // 重新获取最新数据
    } catch (err: any) {
      setError(err.message || '添加YAML文件失败');
      throw err;
    }
  };

  // 更新DSL文件
  const updateDslFile = async (groupId: string, fileId: string, dslFileData: { name?: string; content?: string }) => {
    try {
      await promptGroupAPI.updateDslFile(groupId, fileId, dslFileData);
      await fetchPromptGroups(); // 重新获取最新数据
    } catch (err: any) {
      setError(err.message || '更新YAML文件失败');
      throw err;
    }
  };

  // 删除DSL文件
  const deleteDslFile = async (groupId: string, fileId: string) => {
    try {
      await promptGroupAPI.deleteDslFile(groupId, fileId);
      await fetchPromptGroups(); // 重新获取最新数据
    } catch (err: any) {
      setError(err.message || '删除YAML文件失败');
      throw err;
    }
  };

  // 添加分类
  const addCategory = async (categoryData: { name: string; color: string }) => {
    try {
      const newCategory = await categoryAPI.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
    } catch (err: any) {
      setError(err.message || '添加分类失败');
      throw err;
    }
  };

  // 更新分类
  const updateCategory = async (id: string, categoryData: { name: string; color: string }) => {
    try {
      await categoryAPI.update(id, categoryData);
      await fetchCategories(); // 重新获取最新数据
    } catch (err: any) {
      setError(err.message || '更新分类失败');
      throw err;
    }
  };

  // 删除分类
  const deleteCategory = async (id: string) => {
    try {
      await categoryAPI.delete(id);
      setCategories(prev => prev.filter(category => category._id !== id));
    } catch (err: any) {
      setError(err.message || '删除分类失败');
      throw err;
    }
  };

  const value = {
    promptGroups,
    categories,
    loading,
    error,
    fetchPromptGroups,
    fetchCategories,
    addPromptGroup,
    updatePromptGroup,
    deletePromptGroup,
    addPrompt,
    updatePrompt,
    deletePrompt,
    addDslFile,
    updateDslFile,
    deleteDslFile,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};