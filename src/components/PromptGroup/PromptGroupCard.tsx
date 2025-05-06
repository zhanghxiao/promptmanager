import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PromptGroup } from '../../types';
import Card, { CardHeader, CardContent, CardFooter } from '../common/Card';
import CategoryBadge from '../Category/CategoryBadge';
import { useApp } from '../../contexts/AppContext';

interface PromptGroupCardProps {
  promptGroup: PromptGroup;
  className?: string;
}

const PromptGroupCard: React.FC<PromptGroupCardProps> = ({
  promptGroup,
  className = ''
}) => {
  const navigate = useNavigate();
  const { categories } = useApp();
  
  const category = categories.find(c => c._id === promptGroup.category);
  
  const handleClick = () => {
    navigate(`/prompt-group/${promptGroup._id}`);
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
    <Card 
      className={`${className}`} 
      hoverable 
      onClick={handleClick}
    >
      <CardHeader 
        title={promptGroup.name}
        subtitle={formatDate(promptGroup.updatedAt)}
        action={category && <CategoryBadge category={category} />}
      />
      <CardContent>
        <p className="text-gray-600 line-clamp-2">{promptGroup.description || '无描述'}</p>
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <div className="flex items-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            {promptGroup.prompts.length} 个提示词
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            {promptGroup.workflows.length} 个工作流
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          创建于 {formatDate(promptGroup.createdAt)}
        </div>
        <button 
          className="text-blue-500 flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/prompt-group/${promptGroup._id}`);
          }}
        >
          查看详情
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </CardFooter>
    </Card>
  );
};

export default PromptGroupCard;