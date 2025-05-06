import React from 'react';
import Layout from '../components/Layout/Layout';
import PromptGroupList from '../components/PromptGroup/PromptGroupList';
import { useApp } from '../contexts/AppContext';

const HomePage: React.FC = () => {
  // eslint-disable-next-line
  const { promptGroups } = useApp();

  return (
    <Layout title="提示词管理">
      <PromptGroupList />
    </Layout>
  );
};

export default HomePage;