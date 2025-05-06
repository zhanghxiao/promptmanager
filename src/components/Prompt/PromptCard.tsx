import React from 'react';
import { Prompt } from '../../types';
import Card, { CardHeader, CardContent, CardFooter } from '../common/Card';
import Button from '../common/Button';

interface PromptCardProps {
  prompt: Prompt;
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  className?: string;
  showActions?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onEdit,
  onDelete,
  onExport,
  className = '',
  showActions = true,
  selected = false,
  onSelect
}) => {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 截断长内容并添加"查看更多"
  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <Card className={`${className}`}>
      <CardHeader
        title={prompt.title}
        subtitle={`更新于 ${formatDate(prompt.updatedAt)}`}
        action={
          onSelect && (
            <div 
              className={`
                w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center cursor-pointer
                ${selected ? 'bg-blue-50' : ''}
              `}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              {selected && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
          )
        }
      />
      
      <CardContent>
        {/* 添加 max-h-48 (192px) 和 overflow-y-auto 来限制高度并启用滚动 */}
        <pre className="whitespace-pre-wrap text-gray-700 mb-4 font-sans max-h-48 overflow-y-auto">
          {truncateContent(prompt.content)}
        </pre>
        
        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap mb-3">
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
        
        <div className="text-xs text-gray-500">
          创建于 {formatDate(prompt.createdAt)}
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter>
          <div className="flex justify-end space-x-2">
            {onExport && (
              <Button
                variant="secondary"
                size="small"
                onClick={(e) => {
                  if (e) e.stopPropagation();
                  onExport();
                }}
              >
                导出
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="secondary"
                size="small"
                onClick={(e) => {
                  if (e) e.stopPropagation();
                  onEdit();
                }}
              >
                编辑
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="danger"
                size="small"
                onClick={(e) => {
                  if (e) e.stopPropagation();
                  onDelete();
                }}
              >
                删除
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default PromptCard;