import React, { useState } from 'react';
import { Prompt } from '../../types';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';


interface PromptFormProps {
  initialPrompt?: Partial<Prompt>;
  onSubmit: (prompt: { title: string; content: string; tags: string[] }) => void;
  onCancel: () => void;
}
const PromptForm: React.FC<PromptFormProps> = ({
  initialPrompt = {},
  onSubmit,
  onCancel
}) => {
  const [title, setTitle] = useState(initialPrompt.title || '');
  const [content, setContent] = useState(initialPrompt.content || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialPrompt.tags || []);
  const [errors, setErrors] = useState({
    title: '',
    content: ''
  });

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // 如果标签已存在，则不添加
    if (tags.includes(tagInput.trim())) {
      setTagInput('');
      return;
    }
    
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validate = (): boolean => {
    const newErrors = {
      title: '',
      content: ''
    };
    
    if (!title.trim()) {
      newErrors.title = '请输入提示词标题';
    }
    
    if (!content.trim()) {
      newErrors.content = '请输入提示词内容';
    }
    
    setErrors(newErrors);
    
    return !newErrors.title && !newErrors.content;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      tags
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="标题"
        placeholder="输入提示词标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
      />
      
      <TextArea
        label="内容"
        placeholder="输入提示词内容..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={errors.content}
        rows={10}
        className="max-h-80 overflow-y-auto" // 添加最大高度和滚动
        required
      />
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          标签
        </label>
        <div className="flex flex-wrap mb-2">
          {tags.map((tag) => (
            <div 
              key={tag} 
              className="ios-tag bg-blue-100 text-blue-800 flex items-center"
            >
              {tag}
              <button
                type="button"
                className="ml-1 text-blue-600 hover:text-blue-800"
                onClick={() => handleRemoveTag(tag)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            placeholder="添加标签"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 mb-0"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddTag}
            className="ml-2"
          >
            添加
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          取消
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          保存
        </Button>
      </div>
    </form>
  );
};

export default PromptForm;