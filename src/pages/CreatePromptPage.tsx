import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import PromptForm from '../components/Prompt/PromptForm';
import { useApp } from '../contexts/AppContext';

const CreatePromptPage: React.FC = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { promptGroups, addPrompt } = useApp();

  if (!groupId) {
    return <div>提示词组ID无效</div>;
  }

  const promptGroup = promptGroups.find(group => group._id === groupId);

  if (!promptGroup) {
    return (
      <Layout title="未找到" showBackButton>
        <div className="ios-empty-state">
          <h3 className="ios-empty-state-title">未找到提示词组</h3>
          <p className="ios-empty-state-text">该提示词组可能已被删除</p>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (promptData: Parameters<typeof addPrompt>[1]) => {
    addPrompt(groupId, promptData);
    navigate(`/prompt-group/${groupId}`);
  };

  return (
    <Layout title="创建提示词" showBackButton>
      <Card>
        <CardHeader title={`在"${promptGroup.name}"中创建新提示词`} />
        <CardContent>
          <PromptForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/prompt-group/${groupId}`)}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CreatePromptPage;