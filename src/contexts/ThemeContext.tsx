import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从本地存储获取主题模式，默认为'system'
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'system';
  });
  
  // 判断当前是否为深色模式
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // 当主题模式改变时，更新本地存储和文档根节点类名
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    updateTheme();
  }, [themeMode]);
  
  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (themeMode === 'system') {
        updateTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    updateTheme();
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);
  
  // 更新主题
  const updateTheme = () => {
    const isDark = 
      themeMode === 'dark' || 
      (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
    
    // 更新文档根节点的类名
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // 设置主题模式
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };
  
  // 切换主题（仅在light/dark之间切换，不涉及system）
  const toggleTheme = () => {
    setThemeModeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  
  const value = {
    themeMode,
    isDarkMode,
    setThemeMode,
    toggleTheme
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};