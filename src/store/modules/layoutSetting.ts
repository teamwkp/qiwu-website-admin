import { reactive, computed, watchPostEffect } from 'vue';
import { defineStore } from 'pinia';
import { theme as antdTheme } from 'ant-design-vue';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import { THEME_KEY } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';
import { themeColor, type ThemeColor } from '@/layout/header/components/setting/constant';

/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 */

export type LayoutSetting = {
  navTheme: ThemeColor; // theme for nav menu
  colorPrimary: string; // '#F5222D', // primary color of ant design
  layout: 'sidemenu' | 'topmenu'; // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid' | 'Fixed'; // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false; // sticky header
  fixSiderbar: false; // sticky siderbar
  colorWeak: false;
  menu: {
    locale: true;
  };
  title: string;
  pwa: false;
  iconfontUrl: string;
  // production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
};

export const defaultSetting: LayoutSetting = {
  navTheme: 'dark', // theme for nav menu
  colorPrimary: '#ff3300', // '#F5222D', // primary color of ant design
  // colorPrimary: '#1677FF', // '#F5222D', // primary color of ant design
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false, // sticky header
  fixSiderbar: false, // sticky siderbar
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'vite-antdv-admin',
  pwa: false,
  iconfontUrl: '',
  // production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
};

export const useLayoutSettingStore = defineStore('layout-setting', () => {
  const localLayoutSetting = Storage.get<LayoutSetting>(THEME_KEY, {});

  const layoutSetting = reactive({ ...defaultSetting, ...localLayoutSetting });

  const themeConfig = reactive<ThemeConfig>({
    algorithm: themeColor[layoutSetting.navTheme!] || antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: layoutSetting.colorPrimary,
    },
  });

  const getNavTheme = computed(() => {
    return layoutSetting.navTheme;
  });

  watchPostEffect(() => {
    console.log('🚀 ~ watchPostEffect ~ watchPostEffect:');
    setColorPrimary('#ff3300');
    if (layoutSetting.navTheme) {
      toggleTheme(layoutSetting.navTheme);
    }
    if (layoutSetting.colorPrimary) {
      console.log('🚀 ~ watchPostEffect ~ layoutSetting.colorPrimary:', layoutSetting.colorPrimary);
      setColorPrimary(layoutSetting.colorPrimary);
    }
    // 修改项目配置时自动同步到 localStorage
    Storage.set(THEME_KEY, layoutSetting);
  });

  // 切换主题
  const toggleTheme = (navTheme: ThemeColor) => {
    if (navTheme === 'realDark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    themeConfig.algorithm = themeColor[navTheme];
  };

  /** 设置主题色 */
  const setColorPrimary = (color?: string) => {
    themeConfig.token!.colorPrimary = color || '#ff3300';
  };

  const updateLayoutSetting = (settings: Partial<LayoutSetting>) => {
    Object.assign(layoutSetting, settings);
  };

  return {
    layoutSetting,
    themeConfig,
    getNavTheme,
    toggleTheme,
    setColorPrimary,
    updateLayoutSetting,
  };
});
