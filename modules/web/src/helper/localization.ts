/**
 * Localization utility functions
 * For handling date, number formatting needs for Chinese and English users
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

/**
 * Get date-fns locale for current language
 */
export function getDateLocale(language: string) {
  return language.startsWith('zh') ? zhCN : enUS;
}

/**
 * Format date time - user friendly for Chinese users
 * @param dateString ISO date string
 * @param language Current language
 * @returns Formatted date string
 */
export function formatDateTime(dateString: string | undefined, language: string): string {
  if (!dateString) return '-';

  try {
    const date = parseISO(dateString);
    const locale = getDateLocale(language);

    if (language.startsWith('zh')) {
      // Chinese format: 2024年1月15日 14:30
      return format(date, 'yyyy年M月d日 HH:mm:ss', { locale });
    } else {
      // English format: Jan 15, 2024 2:30 PM
      return format(date, 'MMM dd, yyyy h:mm:ss a', { locale });
    }
  } catch (error) {
    return dateString;
  }
}

/**
 * Format relative time - creation time display
 * @param dateString ISO date string
 * @param language Current language
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | undefined, language: string): string {
  if (!dateString) return '-';

  try {
    const date = parseISO(dateString);
    const locale = getDateLocale(language);

    const relativeTime = formatDistanceToNow(date, {
      addSuffix: true,
      locale
    });

    if (language.startsWith('zh')) {
      // Chinese relative time optimization
      return relativeTime
        .replace('大约', '')
        .replace('不到', '不足')
        .replace('超过', '超过');
    }

    return relativeTime;
  } catch (error) {
    return dateString;
  }
}

/**
 * Format numbers - Chinese thousand separators
 * @param num Number
 * @param language Current language
 * @returns Formatted number string
 */
export function formatNumber(num: number | string | undefined, language: string): string {
  if (num === undefined || num === null || num === '') return '-';

  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numValue)) return String(num);

  if (language.startsWith('zh')) {
    // Chinese number format: using Chinese comma separators
    return new Intl.NumberFormat('zh-CN').format(numValue);
  } else {
    // English number format
    return new Intl.NumberFormat('en-US').format(numValue);
  }
}

/**
 * Format percentage
 * @param value Numeric value (0-1 or 0-100)
 * @param language Current language
 * @param isDecimal Whether it's decimal form (0-1)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | string | undefined,
  language: string,
  isDecimal: boolean = false
): string {
  if (value === undefined || value === null || value === '') return '-';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return String(value);

  const percentage = isDecimal ? numValue : numValue / 100;

  if (language.startsWith('zh')) {
    return new Intl.NumberFormat('zh-CN', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(percentage);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(percentage);
  }
}

/**
 * Format storage size
 * @param bytes Bytes count
 * @param language Current language
 * @returns Formatted storage size string
 */
export function formatStorageSize(bytes: number | string | undefined, language: string): string {
  if (bytes === undefined || bytes === null || bytes === '') return '-';

  const numBytes = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
  if (isNaN(numBytes)) return String(bytes);

  const units = language.startsWith('zh')
    ? ['字节', 'KB', 'MB', 'GB', 'TB', 'PB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  if (numBytes === 0) return `0 ${units[0]}`;

  const k = 1024;
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  const size = (numBytes / Math.pow(k, i)).toFixed(1);

  return `${size} ${units[i]}`;
}

/**
 * Format CPU resource
 * @param cpu CPU value (like "100m", "1.5")
 * @param language Current language
 * @returns Formatted CPU string
 */
export function formatCpuResource(cpu: string | undefined, language: string): string {
  if (!cpu) return '-';

  // Handle millicpu format (like "100m")
  if (cpu.endsWith('m')) {
    const milliCpu = parseInt(cpu.slice(0, -1));
    if (language.startsWith('zh')) {
      return `${milliCpu}毫核`;
    } else {
      return `${milliCpu}m`;
    }
  }

  // Handle normal number format
  const cpuValue = parseFloat(cpu);
  if (!isNaN(cpuValue)) {
    if (language.startsWith('zh')) {
      return `${cpuValue}核`;
    } else {
      return `${cpuValue} cores`;
    }
  }

  return cpu;
}

/**
 * Format memory resource
 * @param memory Memory value (like "128Mi", "1Gi")
 * @param language Current language
 * @returns Formatted memory string
 */
export function formatMemoryResource(memory: string | undefined, language: string): string {
  if (!memory) return '-';

  // Kubernetes memory unit conversion
  const units = {
    'Ki': 1024,
    'Mi': 1024 * 1024,
    'Gi': 1024 * 1024 * 1024,
    'Ti': 1024 * 1024 * 1024 * 1024,
    'K': 1000,
    'M': 1000 * 1000,
    'G': 1000 * 1000 * 1000,
    'T': 1000 * 1000 * 1000 * 1000,
  };

  for (const [unit, multiplier] of Object.entries(units)) {
    if (memory.endsWith(unit)) {
      const value = parseFloat(memory.slice(0, -unit.length));
      const bytes = value * multiplier;
      return formatStorageSize(bytes, language);
    }
  }

  return memory;
}

/**
 * Format status text
 * @param status Status value
 * @param language Current language
 * @returns Localized status text
 */
export function formatStatus(status: string | undefined, language: string): string {
  if (!status) return '-';

  // Add more status localization as needed
  const statusMap: Record<string, { zh: string; en: string }> = {
    'Running': { zh: '运行中', en: 'Running' },
    'Pending': { zh: '等待中', en: 'Pending' },
    'Failed': { zh: '失败', en: 'Failed' },
    'Succeeded': { zh: '成功', en: 'Succeeded' },
    'Ready': { zh: '就绪', en: 'Ready' },
    'NotReady': { zh: '未就绪', en: 'Not Ready' },
    'Active': { zh: '活跃', en: 'Active' },
    'Inactive': { zh: '不活跃', en: 'Inactive' },
  };

  const statusInfo = statusMap[status];
  if (statusInfo) {
    return language.startsWith('zh') ? statusInfo.zh : statusInfo.en;
  }

  return status;
}
