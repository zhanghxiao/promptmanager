import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'https://samlax12-promptbackend.hf.space/api', // 使用实际后端地址
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器，添加认证信息
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器，处理错误
api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    // 认证失败，清除登录信息并重定向到登录页
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

// 用户认证相关 API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    // eslint-disable-next-line
    const { token, _id, username: user } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', user);
    return response.data;
  },
  
  getProfile: async () => {
    return api.get('/auth/profile');
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// 分类相关 API
export const categoryAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  create: async (data: { name: string; color: string }) => {
    const response = await api.post('/categories', data);
    return response.data;
  },
  
  update: async (id: string, data: { name: string; color: string }) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

// 提示词组相关 API
export const promptGroupAPI = {
  getAll: async () => {
    const response = await api.get('/prompt-groups');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/prompt-groups/${id}`);
    return response.data;
  },
  
  create: async (data: { name: string; description: string; category: string }) => {
    const response = await api.post('/prompt-groups', data);
    return response.data;
  },
  
  update: async (id: string, data: { name: string; description: string; category: string }) => {
    const response = await api.put(`/prompt-groups/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/prompt-groups/${id}`);
    return response.data;
  },
  
  // 提示词相关操作
  addPrompt: async (groupId: string, data: { title: string; content: string; tags: string[] }) => {
    const response = await api.post(`/prompt-groups/${groupId}/prompts`, data);
    return response.data;
  },
  
  updatePrompt: async (groupId: string, promptId: string, data: { title: string; content: string; tags: string[] }) => {
    const response = await api.put(`/prompt-groups/${groupId}/prompts/${promptId}`, data);
    return response.data;
  },
  
  deletePrompt: async (groupId: string, promptId: string) => {
    const response = await api.delete(`/prompt-groups/${groupId}/prompts/${promptId}`);
    return response.data;
  },
  
  // DSL 文件相关操作 - 更新为支持内容上传
  addDslFile: async (groupId: string, data: { name: string; content?: string; fileData?: string; mimeType?: string }) => {
    const response = await api.post(`/prompt-groups/${groupId}/dsl-files`, data);
    return response.data;
  },
  
  updateDslFile: async (groupId: string, fileId: string, data: { name?: string; content?: string }) => {
    const response = await api.put(`/prompt-groups/${groupId}/dsl-files/${fileId}`, data);
    return response.data;
  },
  
  deleteDslFile: async (groupId: string, fileId: string) => {
    const response = await api.delete(`/prompt-groups/${groupId}/dsl-files/${fileId}`);
    return response.data;
  }
};

export default api;