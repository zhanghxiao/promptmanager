/**
 * 通用辅助工具函数
 */

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  /**
   * 格式化日期为本地字符串
   * @param date 日期对象或日期字符串
   * @param options 格式化选项
   * @returns 格式化后的日期字符串
   */
  export const formatDate = (
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  ): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('zh-CN', options);
  };
  
  /**
   * 格式化日期和时间为本地字符串
   * @param date 日期对象或日期字符串
   * @returns 格式化后的日期和时间字符串
   */
  export const formatDateTime = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * 截断文本到指定长度
   * @param text 需要截断的文本
   * @param maxLength 最大长度
   * @param suffix 省略号后缀，默认为"..."
   * @returns 截断后的文本
   */
  export const truncateText = (
    text: string,
    maxLength: number,
    suffix: string = '...'
  ): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + suffix;
  };
  
  /**
   * 深度克隆对象
   * @param obj 需要克隆的对象
   * @returns 克隆后的对象
   */
  export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  /**
   * 按属性对对象数组进行排序
   * @param array 对象数组
   * @param key 排序键
   * @param ascending 是否升序，默认为true
   * @returns 排序后的数组
   */
  export const sortByProperty = <T>(
    array: T[],
    key: keyof T,
    ascending: boolean = true
  ): T[] => {
    return [...array].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
      
      if (valueA === valueB) return 0;
      
      // 处理日期对象
      if (valueA instanceof Date && valueB instanceof Date) {
        return ascending ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
      }
      
      // 处理字符串
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
      
      // 处理数字
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return ascending ? valueA - valueB : valueB - valueA;
      }
      
      // 默认使用字符串比较
      return ascending
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  };
  
  /**
   * 延迟执行（Promise形式）
   * @param ms 延迟毫秒数
   * @returns Promise
   */
  export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  /**
   * 防抖函数
   * @param func 要执行的函数
   * @param wait 等待时间（毫秒）
   * @returns 防抖处理后的函数
   */
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    
    return function (...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * 节流函数
   * @param func 要执行的函数
   * @param limit 时间限制（毫秒）
   * @returns 节流处理后的函数
   */
  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    
    return function (...args: Parameters<T>) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
  
  /**
   * 过滤对象数组
   * @param array 对象数组
   * @param searchTerm 搜索关键词
   * @param keys 要搜索的属性键数组
   * @returns 过滤后的数组
   */
  export const filterArrayBySearchTerm = <T>(
    array: T[],
    searchTerm: string,
    keys: (keyof T)[]
  ): T[] => {
    if (!searchTerm) return array;
    
    const lowercasedTerm = searchTerm.toLowerCase();
    
    return array.filter(item => {
      return keys.some(key => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowercasedTerm);
      });
    });
  };
  
  /**
   * 分组对象数组
   * @param array 对象数组
   * @param key 分组键
   * @returns 分组后的对象
   */
  export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {} as Record<string, T[]>);
  };
  
  /**
   * 检查对象是否为空
   * @param obj 要检查的对象
   * @returns 布尔值，指示对象是否为空
   */
  export const isEmptyObject = (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
  };
  
  /**
   * 从数组中移除重复项
   * @param array 数组
   * @returns 去重后的数组
   */
  export const removeDuplicates = <T>(array: T[]): T[] => {
    return [...new Set(array)];
  };
  
  /**
   * 从日期对象获取YYYY-MM-DD格式的日期字符串
   * @param date 日期对象
   * @returns 格式化后的日期字符串
   */
  export const getFormattedDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };