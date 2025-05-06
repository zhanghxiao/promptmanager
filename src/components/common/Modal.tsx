import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnClickOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 处理ESC按键关闭模态框
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // 阻止点击模态框内部时传播到外部背景
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // 处理点击背景关闭模态框
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // 防止模态框打开时页面滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // 获取模态框大小样式
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      default:
        return 'max-w-lg';
    }
  };
  
  if (!isOpen) return null;
  
  // 使用React Portal将模态框渲染到DOM树的最顶层
  return ReactDOM.createPortal(
    <div 
      className={`ios-modal-backdrop open fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex items-center justify-center p-4`}
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`ios-modal ${getSizeClass()} bg-white rounded-xl shadow-xl transform transition-all`}
        onClick={handleModalClick}
      >
        {title && (
          <div className="ios-modal-header px-6 py-4 border-b border-gray-200">
            <h3 className="ios-modal-title text-lg font-semibold text-center">{title}</h3>
          </div>
        )}
        
        <div className="ios-modal-body p-6 max-h-[70vh] overflow-auto">
          {children}
        </div>
        
        {footer && (
          <div className="ios-modal-footer border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// 预定义的模态框按钮布局
export const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`flex border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

// 预定义的模态框按钮
export const ModalButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}> = ({ 
  children, 
  onClick, 
  variant = 'secondary',
  className = '' 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'text-blue-600 hover:bg-blue-50';
      case 'secondary':
        return 'text-gray-600 hover:bg-gray-50';
      case 'danger':
        return 'text-red-600 hover:bg-red-50';
      default:
        return 'text-gray-600 hover:bg-gray-50';
    }
  };
  
  return (
    <button
      className={`
        flex-1 py-3 px-5 text-center font-medium text-sm transition-colors duration-200
        ${getVariantClass()}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Modal;