import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showBackButton = false,
  rightAction
}) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 桌面侧边栏 - 仅在中等及更大屏幕显示 */}
      <div className="hidden md:block w-64 border-r border-gray-200 bg-white">
        <Sidebar />
      </div>
      
      {/* 主内容区 */}
      <div className="flex flex-col flex-1 w-full">
        <Header 
          title={title} 
          showBackButton={showBackButton} 
          rightAction={rightAction} 
        />
        
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-auto">
          {/* 包装器，提供合适的最大宽度 */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* 移动导航 - 仅在小屏幕显示 */}
        <div className="md:hidden">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Layout;