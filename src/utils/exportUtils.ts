import { PromptGroup, Prompt, DslFile } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// 将提示词转换为 Markdown 格式
const formatPromptToMarkdown = (prompt: Prompt): string => {
  return `# ${prompt.title}

${prompt.content}

## 标签
${prompt.tags.map(tag => `- ${tag}`).join('\n')}

## 元数据
- 创建时间: ${new Date(prompt.createdAt).toLocaleString()}
- 更新时间: ${new Date(prompt.updatedAt).toLocaleString()}
`;
};

// 导出提示词组为 ZIP
export const exportPromptGroupToZip = async (group: PromptGroup) => {
  const zip = new JSZip();
  
  // 创建提示词文件夹
  const promptsFolder = zip.folder('prompts');
  if (!promptsFolder) throw new Error('创建提示词文件夹失败');
  
  // 添加提示词为 Markdown 文件
  group.prompts.forEach(prompt => {
    const content = formatPromptToMarkdown(prompt);
    promptsFolder.file(`${prompt.title.replace(/[\\/:*?"<>|]/g, '_')}.md`, content);
  });
  
  // 创建 DSL 文件文件夹
  const dslFolder = zip.folder('dsl_files');
  if (!dslFolder) throw new Error('创建 DSL 文件夹失败');
  
  // 添加 DSL 文件 - 直接使用文本内容
  group.dslFiles.forEach(file => {
    try {
      dslFolder.file(file.name, file.content);
    } catch (error) {
      console.error(`处理文件 ${file.name} 时出错:`, error);
    }
  });
  
  // 添加元数据文件
  const metadata = JSON.stringify({
    name: group.name,
    description: group.description,
    category: typeof group.category === 'object' ? group.category.name : group.category,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    promptCount: group.prompts.length,
    dslFileCount: group.dslFiles.length
  }, null, 2);
  
  zip.file('metadata.json', metadata);
  
  // 创建并下载 ZIP 文件
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const fileName = `${group.name.replace(/[\\/:*?"<>|]/g, '_')}_${new Date().toISOString().split('T')[0]}.zip`;
  saveAs(zipBlob, fileName);
};

// 导出单个提示词为 Markdown
export const exportPrompt = (prompt: Prompt) => {
  const content = formatPromptToMarkdown(prompt);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${prompt.title.replace(/[\\/:*?"<>|]/g, '_')}.md`);
};

// 导出多个提示词为 ZIP
export const exportMultiplePrompts = async (prompts: Prompt[]) => {
  const zip = new JSZip();
  
  prompts.forEach(prompt => {
    const content = formatPromptToMarkdown(prompt);
    zip.file(`${prompt.title.replace(/[\\/:*?"<>|]/g, '_')}.md`, content);
  });
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `prompts_${new Date().toISOString().split('T')[0]}.zip`);
};

// 导出单个 DSL 文件
export const exportDslFile = (file: DslFile) => {
  const blob = new Blob([file.content], { type: 'text/yaml;charset=utf-8' });
  saveAs(blob, file.name);
};

// 导出多个 DSL 文件为 ZIP
export const exportMultipleDslFiles = async (files: DslFile[]) => {
  const zip = new JSZip();
  
  files.forEach(file => {
    zip.file(file.name, file.content);
  });
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `dsl_files_${new Date().toISOString().split('T')[0]}.zip`);
};
// eslint-disable-next-line
export default {
  exportPrompt,
  exportMultiplePrompts,
  exportPromptGroupToZip,
  exportDslFile,
  exportMultipleDslFiles
};