import React, { useState } from 'react';
import { PromptGroup } from '../../types';
import Card, { CardHeader, CardContent, CardFooter } from '../common/Card';
import Button from '../common/Button';
import CategoryBadge from '../Category/CategoryBadge';
import { useApp } from '../../contexts/AppContext';
import Modal, { ModalFooter, ModalButton } from '../common/Modal';
import { exportPromptGroupToZip } from '../../utils/exportUtils';

interface PromptGroupDetailProps {
  promptGroup: PromptGroup;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const PromptGroupDetail: React.FC<PromptGroupDetailProps> = ({
  promptGroup,
  onEdit,
  onDelete,
  className = ''
}) => {
  const { categories } = useApp();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const category = categories.find(c => c._id === promptGroup.category);
  
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleExport = () => {
    exportPromptGroupToZip(promptGroup);
  };
  
  const handleDelete = () => {
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  return (
    <div className={className}>
      <Card>
        <CardContent className="pt-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold mr-2">{promptGroup.name}</h1>
                {category && <CategoryBadge category={category} />}
              </div>
              
              <p className="text-gray-600 mb-4">{promptGroup.description || '无描述'}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center mr-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  {promptGroup.prompts.length} 个提示词
                </div>
                <div className="flex items-center mr-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                  {promptGroup.workflows.length} 个工作流
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  {promptGroup.dslFiles.length} 个DSL文件
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">创建时间</p>
                  <p>{formatDate(promptGroup.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">更新时间</p>
                  <p>{formatDate(promptGroup.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={handleExport}
          >
            导出
          </Button>
          <Button
            variant="secondary"
            onClick={onEdit}
          >
            编辑
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            删除
          </Button>
        </CardFooter>
      </Card>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="删除提示词组"
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
        <p className="text-center mb-4">您确定要删除这个提示词组吗？</p>
        <p className="text-center text-gray-500 text-sm">此操作不可撤销。所有关联的提示词和DSL文件也将被删除。</p>
      </Modal>
    </div>
  );
};

export default PromptGroupDetail;