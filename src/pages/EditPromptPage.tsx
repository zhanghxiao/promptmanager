import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import PromptForm from '../components/Prompt/PromptForm';
import { useApp } from '../contexts/AppContext';

const EditPromptPage: React.FC = () => {
  const { groupId, promptId } = useParams<{ groupId: string; promptId: string }>();
  const navigate = useNavigate();
  const { promptGroups, updatePrompt } = useApp();

  if (!groupId || !promptId) {
    return <div>参数无效</div>;
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

  const prompt = promptGroup.prompts.find(p => p._id === promptId);

  if (!prompt) {
    return (
      <Layout title="未找到" showBackButton>
        <div className="ios-empty-state">
          <h3 className="ios-empty-state-title">未找到提示词</h3>
          <p className="ios-empty-state-text">该提示词可能已被删除</p>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (promptData: { title: string; content: string; tags: string[] }) => {
    updatePrompt(groupId, prompt._id, promptData);
    navigate(`/prompt-group/${groupId}`);
  };
  
  return (
    <Layout title="编辑提示词" showBackButton>
      <Card>
        <CardHeader title={`编辑: ${prompt.title}`} />
        <CardContent>
          <PromptForm
            initialPrompt={prompt}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/prompt-group/${groupId}`)}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default EditPromptPage;