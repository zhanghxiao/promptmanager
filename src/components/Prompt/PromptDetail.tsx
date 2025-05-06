import React, { useState } from 'react';
import { Prompt } from '../../types';
import Card, { CardHeader, CardContent, CardFooter } from '../common/Card';
import Button from '../common/Button';
import Modal, { ModalFooter, ModalButton } from '../common/Modal';
import { exportPrompt } from '../../utils/exportUtils';

interface PromptDetailProps {
  prompt: Prompt;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const PromptDetail: React.FC<PromptDetailProps> = ({
  prompt,
  onEdit,
  onDelete,
  onBack
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleExport = () => {
    exportPrompt(prompt);
  };
  
  const handleDelete = () => {
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content)
      .then(() => {
        alert('提示词内容已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动选择并复制');
      });
  };

  return (
    <div>
      <Card>
        <CardHeader
          title={prompt.title}
          action={
            <Button
              variant="secondary"
              size="small"
              onClick={onBack}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              }
            >
              返回
            </Button>
          }
        />
        
        <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">提示词内容</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {/* 添加最大高度和滚动 */}
            <pre className="whitespace-pre-wrap text-gray-700 font-sans max-h-80 overflow-y-auto">
              {prompt.content}
            </pre>
          </div>
        </div>
          
          {prompt.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">标签</h3>
              <div className="flex flex-wrap">
                {prompt.tags.map((tag) => (
                  <div 
                    key={tag} 
                    className="ios-tag bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">创建时间</p>
                <p className="text-sm">{formatDate(prompt.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">更新时间</p>
                <p className="text-sm">{formatDate(prompt.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div>
            <Button
              variant="secondary"
              size="small"
              onClick={handleCopy}
            >
              复制内容
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={handleExport}
            >
              导出
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={onEdit}
            >
              编辑
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={handleDelete}
            >
              删除
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="删除提示词"
        footer={
          <ModalFooter>
            <ModalButton
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              取消
            </ModalButton>
            <ModalButton
              variant="danger"
              onClick={confirmDelete}
            >
              删除
            </ModalButton>
          </ModalFooter>
        }
      >
        <p className="text-center mb-4">您确定要删除这个提示词吗？</p>
        <p className="text-center text-gray-500 text-sm">此操作不可撤销。</p>
      </Modal>
    </div>
  );
};

export default PromptDetail;