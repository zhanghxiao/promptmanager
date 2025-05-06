import React, { useRef, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Button from '../common/Button';
import Modal, { ModalFooter, ModalButton } from '../common/Modal';
import TextArea from '../common/TextArea';
import Input from '../common/Input';

interface DslFileUploaderProps {
  groupId: string;
  onUploadComplete?: () => void;
}

const DslFileUploader: React.FC<DslFileUploaderProps> = ({ 
  groupId, 
  onUploadComplete 
}) => {
  const { addDslFile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // 用于直接输入 YAML 内容的状态
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    setError('');
    
    try {
      const file = e.target.files[0];
      
      // 验证文件类型
      const validTypes = ['.yml', '.yaml', '.txt', '.json', '.dsl'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        throw new Error('不支持的文件类型。请上传 YAML, JSON, TXT 或 DSL 文件');
      }
      
      // 读取文件内容为文本
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (!event.target || typeof event.target.result !== 'string') {
          throw new Error('文件读取失败');
        }
        
        // 获取文件的文本内容
        const fileContent = event.target.result;
        
        // 修改文件名，确保扩展名为 .yml
        let fileName = file.name;
        if (!fileName.toLowerCase().endsWith('.yml')) {
          fileName = fileName.replace(/\.[^/.]+$/, '') + '.yml';
        }
        
        await addDslFile(groupId, {
          name: fileName,
          content: fileContent
        });
        
        if (onUploadComplete) {
          onUploadComplete();
        }
        
        // 重置 input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
      reader.onerror = () => {
        throw new Error('文件读取错误');
      };
      
      reader.readAsText(file); // 直接读取为文本
    } catch (error: any) {
      console.error('文件上传失败:', error);
      setError(error.message || '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 处理直接粘贴 YAML 内容的提交
  const handleContentSubmit = async () => {
    if (!fileName.trim()) {
      setError('请输入文件名');
      return;
    }

    if (!content.trim()) {
      setError('请输入YAML内容');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      // 确保文件名以 .yml 结尾
      let finalFileName = fileName;
      if (!finalFileName.toLowerCase().endsWith('.yml')) {
        finalFileName = finalFileName.replace(/\.[^/.]+$/, '') + '.yml';
      }
      
      await addDslFile(groupId, {
        name: finalFileName,
        content: content
      });
      
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      // 重置表单并关闭模态框
      setFileName('');
      setContent('');
      setShowModal(false);
    } catch (error: any) {
      console.error('添加YAML失败:', error);
      setError(error.message || '添加失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <div className="flex space-x-2">
        {/* 文件上传按钮 */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".yml,.yaml,.txt,.json,.dsl"
        />
        
        <Button
          variant="primary"
          onClick={triggerFileInput}
          disabled={isUploading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          }
        >
          {isUploading ? '上传中...' : '上传 YAML 文件'}
        </Button>
        
        {/* 添加直接粘贴内容的按钮 */}
        <Button
          variant="secondary"
          onClick={() => setShowModal(true)}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          }
        >
          粘贴 YAML 内容
        </Button>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {/* 粘贴 YAML 内容的模态框 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="添加 YAML 内容"
        footer={
          <ModalFooter>
            <ModalButton
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              取消
            </ModalButton>
            <ModalButton
              variant="primary"
              onClick={handleContentSubmit}
            >
              添加
            </ModalButton>
          </ModalFooter>
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <Input
            label="文件名"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="例如: workflow.yml"
            required
          />
          
          <TextArea
            label="YAML 内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入或粘贴 YAML 内容..."
            rows={12}
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default DslFileUploader;