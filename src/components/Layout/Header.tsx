import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  rightAction
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="ios-navbar">
      <div className="flex items-center justify-between w-full">
        {showBackButton ? (
          <button 
            className="ios-navbar-button flex items-center" 
            onClick={handleBack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>返回</span>
          </button>
        ) : (
          <div className="w-20"></div>
        )}
        
        {title && <h1 className="ios-navbar-title">{title}</h1>}
        
        {rightAction ? (
          <div className="flex items-center">{rightAction}</div>
        ) : (
          <div className="w-20"></div>
        )}
      </div>
    </header>
  );
};

export default Header;