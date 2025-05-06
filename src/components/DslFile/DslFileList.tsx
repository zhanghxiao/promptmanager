import React, { useState } from 'react';
import { DslFile } from '../../types';
import { useApp } from '../../contexts/AppContext';
import Button from '../common/Button';
import TextArea from '../common/TextArea';
import Input from '../common/Input';
import Modal from '../common/Modal';

interface DslFileListProps {
  groupId: string;
  files: DslFile[];
}

const DslFileList: React.FC<DslFileListProps> = ({ groupId, files }) => {
  const { deleteDslFile, updateDslFile } = useApp();
  const [selectedFile, setSelectedFile] = useState<DslFile | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFileName, setEditFileName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');

  if (files.length === 0) {
    return (
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
        <h3 className="ios-empty-state-title">暂无 YAML 文件</h3>
        <p className="ios-empty-state-text">上传或添加 YAML 文件以便于存储和管理</p>
      </div>
    );
  }

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

  const handleDelete = (fileId: string) => {
    if (window.confirm('确定要删除此 YAML 文件吗？此操作不可撤销。')) {
      deleteDslFile(groupId, fileId);
    }
  };

  const handleViewFile = (file: DslFile) => {
    setSelectedFile(file);
    setShowViewModal(true);
  };

  const handleEditFile = (file: DslFile) => {
    setSelectedFile(file);
    setEditFileName(file.name);
    setEditContent(file.content);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedFile) return;
    setError('');

    if (!editFileName.trim()) {
      setError('请输入文件名');
      return;
    }

    if (!editContent.trim()) {
      setError('请输入YAML内容');
      return;
    }

    try {
      await updateDslFile(groupId, selectedFile._id, {
        name: editFileName,
        content: editContent
      });
      setShowEditModal(false);
    } catch (err: any) {
      console.error('更新YAML文件失败:', err);
      setError(err.message || '更新失败，请重试');
    }
  };

  const handleExportFile = (file: DslFile) => {
    // 创建 Blob 对象
    const blob = new Blob([file.content], { type: 'text/yaml' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const getFileIcon = (fileName: string) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5856D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <path d="M8 13h2"></path>
        <path d="M8 17h2"></path>
        <path d="M14 13h2"></path>
        <path d="M14 17h2"></path>
      </svg>
    );
  };

  return (
    <div className="ios-list">
      {files.map((file) => (
        <div key={file._id} className="ios-list-item">
          <div className="mr-3">
            {getFileIcon(file.name)}
          </div>
          <div className="ios-list-item-content">
            <div className="ios-list-item-title">{file.name}</div>
            <div className="ios-list-item-subtitle">
              上传于 {formatDate(file.uploadedAt)}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              className="text-blue-500 p-2"
              onClick={() => handleViewFile(file)}
              title="查看"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button
              className="text-green-500 p-2"
              onClick={() => handleEditFile(file)}
              title="编辑"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              className="text-indigo-500 p-2"
              onClick={() => handleExportFile(file)}
              title="导出"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <button
              className="text-red-500 p-2"
              onClick={() => handleDelete(file._id)}
              title="删除"
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

      {/* 查看文件模态框 */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedFile?.name || "查看 YAML 文件"}
      >
        <div className="space-y-4">
          {selectedFile && (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-96">
                  {selectedFile.content}
                </pre>
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  关闭
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (selectedFile) {
                      handleExportFile(selectedFile);
                    }
                  }}
                >
                  导出
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 编辑文件模态框 */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="编辑 YAML 文件"
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <Input
            label="文件名"
            value={editFileName}
            onChange={(e) => setEditFileName(e.target.value)}
            required
          />
          
          <TextArea
            label="YAML 内容"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={12}
            required
          />
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
            >
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DslFileList;