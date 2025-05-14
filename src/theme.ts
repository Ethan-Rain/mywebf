// 主题颜色类型
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  backgroundColor: string;
  cardBg: string;
  menuBg: string;
  menuText: string;
  menuHover: string;
  menuActive: string;
}

// 主题类型
export interface Theme {
  name: string;
  label?: string;
  colors: ThemeColors;
}

// 若叶睦主题
export const wakabaTheme: Theme = {
  name: 'wakaba',
  colors: {
    primary: '#4e7c5f',
    primaryLight: '#e8f3e9',
    accent: '#f8c291',
    textPrimary: '#2c3e50',
    textSecondary: '#7f8c8d',
    borderColor: '#d1d9d6',
    backgroundColor: '#f5f9f5',
    cardBg: '#ffffff',
    menuBg: '#4e7c5f',
    menuText: '#ffffff',
    menuHover: '#3a5d4a',
    menuActive: '#f8c291',
  },
};

// 暗色主题
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#2c3e50',
    primaryLight: '#34495e',
    accent: '#f8c291',
    textPrimary: '#ecf0f1',
    textSecondary: '#bdc3c7',
    borderColor: '#2c3e50',
    backgroundColor: '#1a1a1a',
    cardBg: '#2d3436',
    menuBg: '#2c3e50',
    menuText: '#ecf0f1',
    menuHover: '#34495e',
    menuActive: '#f8c291',
  },
};

// 亮色主题
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#3498db',
    primaryLight: '#e1f0fa',
    accent: '#3498db',
    textPrimary: '#2c3e50',
    textSecondary: '#7f8c8d',
    borderColor: '#d1d9d6',
    backgroundColor: '#f5f7fa',
    cardBg: '#ffffff',
    menuBg: '#ffffff',
    menuText: '#2c3e50',
    menuHover: '#f5f7fa',
    menuActive: '#3498db',
  },
};

// 所有主题
export const themes = {
  wakaba: wakabaTheme,
  dark: darkTheme,
  light: lightTheme,
} as const;

export type ThemeName = keyof typeof themes;

// 应用主题到文档
export function applyTheme(theme: Theme) {
  try {
    const root = document.documentElement;
    const { colors } = theme;
    
    // 设置CSS变量
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // 设置Element Plus主题色
    root.style.setProperty('--el-color-primary', colors.primary);
    root.style.setProperty('--el-color-primary-light-3', colors.primaryLight);
    root.style.setProperty('--el-color-primary-light-5', colors.primaryLight);
    root.style.setProperty('--el-color-primary-light-7', colors.primaryLight);
    root.style.setProperty('--el-color-primary-light-8', colors.primaryLight);
    root.style.setProperty('--el-color-primary-light-9', colors.primaryLight);
    root.style.setProperty('--el-color-primary-dark-2', colors.primary);
    
    // 设置滚动条颜色
    root.style.setProperty('--scrollbar-thumb', colors.primary);
    root.style.setProperty('--scrollbar-track', colors.backgroundColor);
    
    // 更新文档主题属性
    document.documentElement.setAttribute('data-theme', theme.name);
    
    // 保存到本地存储
    localStorage.setItem('theme', JSON.stringify(theme));
    
    return true;
  } catch (error) {
    console.error('Error applying theme:', error);
    return false;
  }
}

// 从localStorage加载主题
export function loadTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return JSON.parse(savedTheme);
    }
  } catch (e) {
    console.error('Failed to load theme from localStorage', e);
  }
  return wakabaTheme; // 默认返回若叶睦主题
}
