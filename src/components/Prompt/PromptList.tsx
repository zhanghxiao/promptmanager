import React, { useState } from 'react';
import { Prompt } from '../../types';
import Card, { CardHeader, CardContent } from '../common/Card';
import Button from '../common/Button';
import PromptForm from './PromptForm';
import { exportPrompt, exportMultiplePrompts } from '../../utils/exportUtils';

interface PromptListProps {
  groupId: string;
  prompts: Prompt[];
  onAddPrompt: (promptData: { title: string; content: string; tags: string[] }) => void;
  onUpdatePrompt: (promptId: string, promptData: { title: string; content: string; tags: string[] }) => void;
  onDeletePrompt: (promptId: string) => void;
}
const PromptList: React.FC<PromptListProps> = ({
  groupId,
  prompts,
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt
}) => {
  const [showNewPromptForm, setShowNewPromptForm] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const handleEditPrompt = (promptId: string) => {
    setEditingPromptId(promptId);
  };

  const handleDeletePrompt = (promptId: string) => {
    if (window.confirm('确定要删除此提示词吗？此操作不可撤销。')) {
      onDeletePrompt(promptId);
    }
  };

  const handleSavePrompt = (promptData: { title: string; content: string; tags: string[] }) => {
    if (editingPromptId) {
      // 如果正在编辑提示词，调用 onUpdatePrompt
      onUpdatePrompt(editingPromptId, promptData);
      setEditingPromptId(null);
    } else {
      // 如果正在创建新提示词，调用 onAddPrompt
      onAddPrompt(promptData);
      setShowNewPromptForm(false);
    }
  };

  const handleExportPrompt = (prompt: Prompt) => {
    exportPrompt(prompt);
  };

  const handleToggleSelectPrompt = (promptId: string) => {
    setSelectedPrompts(prevSelected => {
      if (prevSelected.includes(promptId)) {
        return prevSelected.filter(id => id !== promptId);
      } else {
        return [...prevSelected, promptId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPrompts.length === prompts.length) {
      setSelectedPrompts([]);
    } else {
      setSelectedPrompts(prompts.map(p => p._id));
    }
  };

  const handleExportSelected = () => {
    const selectedPromptObjects = prompts.filter(p => selectedPrompts.includes(p._id));
    exportMultiplePrompts(selectedPromptObjects);
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`确定要删除选中的 ${selectedPrompts.length} 个提示词吗？此操作不可撤销。`)) {
      selectedPrompts.forEach(promptId => {
        onDeletePrompt(promptId);
      });
      setSelectedPrompts([]);
      setIsSelectMode(false);
    }
  };

  if (prompts.length === 0 && !showNewPromptForm) {
    return (
      <div>
        <div className="ios-empty-state">
          <div className="ios-empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h3 className="ios-empty-state-title">暂无提示词</h3>
          <p className="ios-empty-state-text">添加提示词以便于管理和使用</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => setShowNewPromptForm(true)}
          >
            添加提示词
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">提示词列表</h3>
        <div className="flex space-x-2">
          {isSelectMode ? (
            <>
              <Button
                variant="secondary"
                size="small"
                onClick={handleSelectAll}
              >
                {selectedPrompts.length === prompts.length ? '取消全选' : '全选'}
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleExportSelected}
                disabled={selectedPrompts.length === 0}
              >
                导出选中
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={handleDeleteSelected}
                disabled={selectedPrompts.length === 0}
              >
                删除选中
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setIsSelectMode(false);
                  setSelectedPrompts([]);
                }}
              >
                取消
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setIsSelectMode(true)}
              >
                选择
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => setShowNewPromptForm(true)}
              >
                添加提示词
              </Button>
            </>
          )}
        </div>
      </div>

      {showNewPromptForm && !editingPromptId && (
        <Card className="mb-4">
          <CardHeader title="新增提示词" />
          <CardContent>
            <PromptForm
              onSubmit={handleSavePrompt}
              onCancel={() => setShowNewPromptForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {prompts.map((prompt) => (
          <Card key={prompt._id} className="mb-4">
            {editingPromptId === prompt._id ? (
              <CardContent>
                <PromptForm
                  initialPrompt={prompt}
                  onSubmit={handleSavePrompt}
                  onCancel={() => setEditingPromptId(null)}
                />
              </CardContent>
            ) : (
              <>
                <CardHeader
                  title={prompt.title}
                  subtitle={new Date(prompt.updatedAt).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  action={
                    isSelectMode && (
                      <div 
                        className="w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center cursor-pointer"
                        onClick={() => handleToggleSelectPrompt(prompt._id)}
                      >
                        {selectedPrompts.includes(prompt._id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    )
                  }
                />
                <CardContent>
                  <pre className="whitespace-pre-wrap text-gray-700 mb-4 font-sans max-h-48 overflow-y-auto">
                    {prompt.content}
                  </pre>
                  
                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap mb-4">
                      {prompt.tags.map((tag) => (
                        <div 
                          key={tag} 
                          className="ios-tag bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {!isSelectMode && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleExportPrompt(prompt)}
                      >
                        导出
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleEditPrompt(prompt._id)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeletePrompt(prompt._id)}
                      >
                        删除
                      </Button>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromptList;