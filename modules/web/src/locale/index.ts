import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import zh from './zh.json';

const resources = {
    en: {
        translation: en,
    },
    zh: {
        translation: zh,
    },
};

i18n
    // 检测用户语言
    .use(LanguageDetector)
    // 传递 i18n 实例给 react-i18next
    .use(initReactI18next)
    // 初始化 i18next
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        // 关键配置：避免SSR不匹配
        react: {
            useSuspense: false, // 禁用Suspense，避免SSR问题
        },

        interpolation: {
            escapeValue: false, // React 已经安全处理了
        },

        detection: {
            // 语言检测选项
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
    });

export default i18n;
