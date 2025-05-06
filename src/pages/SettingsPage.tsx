import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [dataExported, setDataExported] = useState(false);
  
  // 导出所有数据
  const handleExportAllData = () => {
    const promptGroups = localStorage.getItem('promptGroups');
    const categories = localStorage.getItem('categories');
    
    const allData = {
      promptGroups: promptGroups ? JSON.parse(promptGroups) : [],
      categories: categories ? JSON.parse(categories) : []
    };
    
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDataExported(true);
      
      // 重置状态
      setTimeout(() => setDataExported(false), 3000);
    }, 0);
  };
  
  // 导入数据文件
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.promptGroups && Array.isArray(data.promptGroups)) {
          localStorage.setItem('promptGroups', JSON.stringify(data.promptGroups));
        }
        
        if (data.categories && Array.isArray(data.categories)) {
          localStorage.setItem('categories', JSON.stringify(data.categories));
        }
        
        alert('数据导入成功，应用将刷新以加载新数据。');
        window.location.reload();
      } catch (error) {
        alert('导入失败，文件格式不正确。');
        console.error('导入错误:', error);
      }
    };
    reader.readAsText(file);
  };
  
  // 清除所有数据
  const handleClearAllData = () => {
    if (window.confirm('确定要清除所有数据吗？此操作不可撤销。')) {
      localStorage.removeItem('promptGroups');
      localStorage.removeItem('categories');
      alert('所有数据已清除，应用将刷新。');
      window.location.reload();
    }
  };

  return (
    <Layout title="设置">
      <div className="space-y-4">
        <Card>
          <CardHeader title="数据管理" />
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">备份数据</h3>
                <p className="text-gray-600 text-sm mb-2">
                  导出所有提示词组和分类数据为JSON文件，可用于备份或迁移。
                </p>
                <Button
                  variant="primary"
                  onClick={handleExportAllData}
                >
                  {dataExported ? '✓ 导出成功' : '导出所有数据'}
                </Button>
              </div>
              
              <div className="ios-divider"></div>
              
              <div>
                <h3 className="font-medium mb-2">导入数据</h3>
                <p className="text-gray-600 text-sm mb-2">
                  从之前导出的JSON文件中恢复数据。将覆盖当前所有数据。
                </p>
                <input
                  type="file"
                  id="import-file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleImportData}
                />
                <Button
                  variant="secondary"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  导入数据
                </Button>
              </div>
              
              <div className="ios-divider"></div>
              
              <div>
                <h3 className="font-medium mb-2">清除数据</h3>
                <p className="text-gray-600 text-sm mb-2">
                  删除所有存储的提示词组和分类数据。此操作不可撤销。
                </p>
                <Button
                  variant="danger"
                  onClick={handleClearAllData}
                >
                  清除所有数据
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader title="关于" />
          <CardContent>
            <h3 className="font-medium mb-2">提示词管理应用</h3>
            <p className="text-gray-600 text-sm mb-4">
              版本 1.0.0
            </p>
            <p className="text-gray-600 text-sm">
              这是一个用于管理提示词、工作流和DSL文件的本地应用。所有数据均存储在浏览器的本地存储中。
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;