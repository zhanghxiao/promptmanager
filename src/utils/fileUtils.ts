/**
 * 文件工具函数，提供文件处理相关的实用方法
 */

/**
 * 将文件转换为Base64编码字符串
 * @param file 文件对象
 * @returns Promise，解析为Base64编码的字符串
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // 从data URI中提取Base64部分
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('读取文件失败'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('读取文件时发生错误'));
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  /**
   * 将Base64编码字符串转换回Blob对象
   * @param base64 Base64编码的字符串
   * @param mimeType MIME类型
   * @returns Blob对象
   */
  export const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  };
  
  /**
   * 获取文件扩展名
   * @param fileName 文件名
   * @returns 文件扩展名（小写，不包含点号）
   */
  export const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };
  
  /**
   * 根据文件扩展名猜测MIME类型
   * @param fileName 文件名
   * @returns MIME类型
   */
  export const guessMimeType = (fileName: string): string => {
    const extension = getFileExtension(fileName);
    
    const mimeTypes: Record<string, string> = {
      'json': 'application/json',
      'txt': 'text/plain',
      'md': 'text/markdown',
      'dsl': 'application/octet-stream',
      'js': 'application/javascript',
      'ts': 'application/typescript',
      'html': 'text/html',
      'css': 'text/css',
      'csv': 'text/csv',
      'xml': 'application/xml',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  };
  
  /**
   * 格式化文件大小为人类可读格式
   * @param bytes 文件大小（字节）
   * @param decimals 小数位数
   * @returns 格式化后的文件大小字符串
   */
  export const formatFileSize = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  /**
   * 检查文件是否为有效的DSL文件类型
   * @param file 文件对象
   * @returns 布尔值，指示文件是否为有效的DSL文件类型
   */
  export const isValidDslFile = (file: File): boolean => {
    const validExtensions = ['dsl', 'json', 'txt'];
    const extension = getFileExtension(file.name);
    
    return validExtensions.includes(extension);
  };
  
  /**
   * 安全的文件名生成（移除不安全字符）
   * @param fileName 原始文件名
   * @returns 安全的文件名
   */
  export const sanitizeFileName = (fileName: string): string => {
    // 移除文件名中的不安全字符
    return fileName.replace(/[\\/:*?"<>|]/g, '_');
  };