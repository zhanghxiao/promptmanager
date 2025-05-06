import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import PromptGroupForm from '../components/PromptGroup/PromptGroupForm';
import { useApp } from '../contexts/AppContext';

const EditPromptGroupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { promptGroups, updatePromptGroup } = useApp();

  if (!id) {
    return <div>提示词组ID无效</div>;
  }

  const promptGroup = promptGroups.find(group => group._id === id);

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

  const handleSubmit = (promptGroupData: { name: string; description: string; category: string }) => {
    updatePromptGroup(promptGroup._id, promptGroupData);
    navigate(`/prompt-group/${promptGroup._id}`);
  };

  return (
    <Layout title="编辑提示词组" showBackButton>
      <Card>
        <CardHeader title={`编辑: ${promptGroup.name}`} />
        <CardContent>
          <PromptGroupForm
            initialPromptGroup={promptGroup}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/prompt-group/${promptGroup._id}`)}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default EditPromptGroupPage;