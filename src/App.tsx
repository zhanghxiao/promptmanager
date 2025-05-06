import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PromptGroupDetailPage from './pages/PromptGroupDetailPage';
import CreatePromptGroupPage from './pages/CreatePromptGroupPage';
import EditPromptGroupPage from './pages/EditPromptGroupPage';
import CategoriesPage from './pages/CategoriesPage';
import SettingsPage from './pages/SettingsPage';
import './styles/global.css';
import './styles/iosStyles.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* 受保护路由 */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/prompt-group/:id" 
              element={
                <ProtectedRoute>
                  <PromptGroupDetailPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreatePromptGroupPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/edit-prompt-group/:id" 
              element={
                <ProtectedRoute>
                  <EditPromptGroupPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute>
                  <CategoriesPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* 默认重定向 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;