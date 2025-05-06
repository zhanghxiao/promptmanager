// 提示词项目组
export interface PromptGroup {
  _id: string;  // 后端使用 _id 而不是 id
  name: string;
  description: string;
  category: string | Category;
  createdAt: string;  // 后端返回的是字符串而不是 Date 对象
  updatedAt: string;
  prompts: Prompt[];
  workflows: string[];
  dslFiles: DslFile[];
  createdBy?: string;
}

// 单个提示词
export interface Prompt {
  _id: string;  // 后端使用 _id 而不是 id
  title: string;
  content: string;
  tags: string[];
  createdAt: string;  // 字符串格式的日期
  updatedAt: string;
}

// DSL文件 - 修改后的接口
export interface DslFile {
  _id: string;  // 后端使用 _id 而不是 id
  name: string;
  content: string;  // 修改: 用于存储 YAML 文本内容
  mimeType: string;
  uploadedAt: string;  // 字符串格式的日期
}

// 分类
export interface Category {
  _id: string;  // 后端使用 _id 而不是 id
  name: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}