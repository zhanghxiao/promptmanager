import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import PromptList from '../components/Prompt/PromptList';
import DslFileList from '../components/DslFile/DslFileList';
import DslFileUploader from '../components/DslFile/DslFileUploader';
import CategoryBadge from '../components/Category/CategoryBadge';
import { useApp } from '../contexts/AppContext';
import { exportPromptGroupToZip } from '../utils/exportUtils';

const PromptGroupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    promptGroups, 
    categories,
    updatePromptGroup,
    deletePromptGroup,
    addPrompt,
    updatePrompt,
    deletePrompt
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'prompts' | 'dslFiles'>('prompts');
  
  if (!id) {
    return <div>提示词组ID无效</div>;
  }
  
  const promptGroup = promptGroups.find(group => group._id === id);
  
  if (!promptGroup) {
    return (
      <Layout title="未找到" showBackButton>
        <div className="ios-empty-state">
          <div className="ios-empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="ios-empty-state-title">未找到提示词组</h3>
          <p className="ios-empty-state-text">该提示词组可能已被删除</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
        </div>
      </Layout>
    );
  }
  
  const category = categories.find(c => c._id === promptGroup.category);
  
  const handleDeletePromptGroup = () => {
    if (window.confirm('确定要删除此提示词组吗？此操作不可撤销，所有相关提示词和文件都将被删除。')) {
      deletePromptGroup(promptGroup._id);
      navigate('/');
    }
  };
  
  const handleExportPromptGroup = () => {
    exportPromptGroupToZip(promptGroup);
  };
  
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout 
      title={promptGroup.name} 
      showBackButton
      rightAction={
        <Button
          variant="primary"
          size="small"
          onClick={handleExportPromptGroup}
        >
          导出
        </Button>
      }
    >
      <Card className="mb-4">
        <CardContent>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{promptGroup.name}</h1>
              {category && <CategoryBadge category={category} className="mb-2" />}
              <p className="text-gray-600 mb-2">{promptGroup.description || '无描述'}</p>
              <div className="text-sm text-gray-500">
                创建于 {formatDate(promptGroup.createdAt)}
                <span className="mx-2">•</span>
                更新于 {formatDate(promptGroup.updatedAt)}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => navigate(`/edit-prompt-group/${promptGroup._id}`)}
              >
                编辑
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={handleDeletePromptGroup}
              >
                删除
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex border-b border-gray-200 mb-4">
        <button 
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'prompts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('prompts')}
        >
          提示词 ({promptGroup.prompts.length})
        </button>
        <button 
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'dslFiles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('dslFiles')}
        >
          DSL文件 ({promptGroup.dslFiles.length})
        </button>
      </div>
      <div className="space-y-4 max-h-screen overflow-y-auto">
      {activeTab === 'prompts' && (
        <PromptList
          groupId={promptGroup._id}
          prompts={promptGroup.prompts}
          onAddPrompt={(promptData) => addPrompt(promptGroup._id, promptData)}
          onUpdatePrompt={(promptId, promptData) => updatePrompt(promptGroup._id, promptId, promptData)}
          onDeletePrompt={(promptId) => deletePrompt(promptGroup._id, promptId)}
        />
      )}
      </div>
      {activeTab === 'dslFiles' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">DSL文件列表</h3>
            <DslFileUploader groupId={promptGroup._id} />
          </div>
          <DslFileList 
            groupId={promptGroup._id}
            files={promptGroup.dslFiles}
          />
        </div>
      )}
    </Layout>
  );
};

export default PromptGroupDetailPage;