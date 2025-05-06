import { useState, useCallback, useEffect } from 'react';
import { PromptGroup, Prompt, DslFile } from '../types';
import useLocalStorage from './useLocalStorage';

/**
 * 自定义钩子，用于管理提示词组数据
 */
function usePromptGroups() {
  // 从本地存储获取提示词组数据
  const [savedPromptGroups, setSavedPromptGroups, clearSavedPromptGroups] = useLocalStorage<PromptGroup[]>('promptGroups', []);
  // 状态管理当前提示词组数据
  const [promptGroups, setPromptGroups] = useState<PromptGroup[]>(processSavedPromptGroups(savedPromptGroups));
  
  // 处理保存的提示词组数据，将日期字符串转换为Date对象
  function processSavedPromptGroups(groups: PromptGroup[]): PromptGroup[] {
    return groups.map(group => ({
      ...group,
      // 不要将字符串转换为 Date 对象
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      prompts: group.prompts.map(prompt => ({
        ...prompt,
        createdAt: prompt.createdAt,
        updatedAt: prompt.updatedAt,
      })),
      dslFiles: group.dslFiles.map(file => ({
        ...file,
        uploadedAt: file.uploadedAt,
      })),
    }));
  }
  
  
  // 当本地存储数据变化时更新状态
  useEffect(() => {
    setPromptGroups(processSavedPromptGroups(savedPromptGroups));
  }, [savedPromptGroups]);
  
  // 生成唯一ID
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);
  
  // 添加提示词组
  const addPromptGroup = useCallback((promptGroup: Omit<PromptGroup, 'id' | 'createdAt' | 'updatedAt' | 'prompts' | 'workflows' | 'dslFiles'>) => {
    const now = new Date().toISOString();
    const newPromptGroup: PromptGroup = {
      ...promptGroup,
      _id: generateId(),
      createdAt: now,
      updatedAt: now,
      prompts: [],
      workflows: [],
      dslFiles: []
    };
    
    setSavedPromptGroups(prev => [...prev, newPromptGroup]);
    return newPromptGroup;
  }, [generateId, setSavedPromptGroups]);
  
  // 更新提示词组
  const updatePromptGroup = useCallback((id: string, promptGroup: Omit<PromptGroup, '_id' | 'createdAt' | 'updatedAt' | 'prompts' | 'workflows' | 'dslFiles'>) => {
    const now = new Date().toISOString();
    setSavedPromptGroups(prev =>
      prev.map(group =>
        group._id === id
          ? { 
              ...group, 
              name: promptGroup.name, 
              description: promptGroup.description, 
              category: promptGroup.category,
              updatedAt: now 
            }
          : group
      )
    );
  }, [setSavedPromptGroups]);
  
  // 删除提示词组
  const deletePromptGroup = useCallback((id: string) => {
    setSavedPromptGroups(prev => prev.filter(group => group._id !== id));
  }, [setSavedPromptGroups]);
  
  // 添加提示词
  const addPrompt = useCallback((groupId: string, prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPrompt: Prompt = {
      ...prompt,
      _id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    setSavedPromptGroups(prev =>
      prev.map(group => {
        if (group._id === groupId) {
          return {
            ...group,
            prompts: [...group.prompts, newPrompt],
            updatedAt: now
          };
        }
        return group;
      })
    );
    
    return newPrompt;
  }, [generateId, setSavedPromptGroups]);
  
  // 更新提示词
// 更新提示词方法
const updatePrompt = useCallback((groupId: string, promptId: string, promptData: { title: string; content: string; tags: string[] }) => {
  const now = new Date().toISOString();
  setSavedPromptGroups(prev =>
    prev.map(group => {
      if (group._id === groupId) {
        return {
          ...group,
          prompts: group.prompts.map(p =>
            p._id === promptId
              ? { 
                  ...p, 
                  title: promptData.title,
                  content: promptData.content,
                  tags: promptData.tags,
                  updatedAt: now 
                }
              : p
          ),
          updatedAt: now
        };
      }
      return group;
    })
  );
}, [setSavedPromptGroups]);
  
  // 删除提示词
  const deletePrompt = useCallback((groupId: string, promptId: string) => {
    const now = new Date().toISOString();
    setSavedPromptGroups(prev =>
      prev.map(group => {
        if (group._id === groupId) {
          return {
            ...group,
            prompts: group.prompts.filter(p => p._id !== promptId),
            updatedAt: now
          };
        }
        return group;
      })
    );
  }, [setSavedPromptGroups]);
  
  // 添加工作流
  const addWorkflow = useCallback((groupId: string, workflow: string) => {
    const now = new Date().toISOString();
    setSavedPromptGroups(prev =>
      prev.map(group => {
        if (group._id === groupId) {
          return {
            ...group,
            workflows: [...group.workflows, workflow],
            updatedAt: now
          };
        }
        return group;
      })
    );
  }, [setSavedPromptGroups]);
  
  // 删除工作流
  const deleteWorkflow = useCallback((groupId: string, workflowIndex: number) => {
    const now = new Date().toISOString();
    setSavedPromptGroups(prev =>
      prev.map(group => {
        if (group._id === groupId) {
          const newWorkflows = [...group.workflows];
          newWorkflows.splice(workflowIndex, 1);
          return {
            ...group,
            workflows: newWorkflows,
            updatedAt: now
          };
        }
        return group;
      })
    );
  }, [setSavedPromptGroups]);
  
  // 添加DSL文件
  const addDslFile = useCallback((groupId: string, dslFile: Omit<DslFile, 'id' | 'uploadedAt'>) => {
    const now = new Date().toISOString();
    const newDslFile: DslFile = {
      ...dslFile,
      _id: generateId(),
      uploadedAt: now
    };
    
    setSavedPromptGroups(prev =>
      prev.map(group => {
        if (group._id === groupId) {
          return {
            ...group,
            dslFiles: [...group.dslFiles, newDslFile],
            updatedAt: now
          };
        }
        return group;
      })
    );
    
    return newDslFile;
  }, [generateId, setSavedPromptGroups]);
  
  // 删除DSL文件
  const deleteDslFile = useCallback((groupId: string, fileId: string) => {
    const now = new Date().toISOString();
    setSavedPromptGroups(prev =>
      prev.map(group => {
        if (group._id === groupId) {
          return {
            ...group,
            dslFiles: group.dslFiles.filter(file => file._id !== fileId),
            updatedAt: now
          };
        }
        return group;
      })
    );
  }, [setSavedPromptGroups]);
  
  // 清除所有提示词组数据
  const clearAllData = useCallback(() => {
    clearSavedPromptGroups();
  }, [clearSavedPromptGroups]);
  
  return {
    promptGroups,
    addPromptGroup,
    updatePromptGroup,
    deletePromptGroup,
    addPrompt,
    updatePrompt,
    deletePrompt,
    addWorkflow,
    deleteWorkflow,
    addDslFile,
    deleteDslFile,
    clearAllData
  };
}

export default usePromptGroups;