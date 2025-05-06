import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import PromptGroupForm from '../components/PromptGroup/PromptGroupForm';
import { useApp } from '../contexts/AppContext';

const CreatePromptGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPromptGroup } = useApp();

  const handleSubmit = (promptGroupData: { name: string; description: string; category: string }) => {
    // Simply pass the form data directly to addPromptGroup
    // The function itself will handle adding the additional properties
    addPromptGroup(promptGroupData);
    navigate('/');
  };

  return (
    <Layout title="创建提示词组" showBackButton>
      <Card>
        <CardHeader title="新建提示词组" />
        <CardContent>
          <PromptGroupForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CreatePromptGroupPage;