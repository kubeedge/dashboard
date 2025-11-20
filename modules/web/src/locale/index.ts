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
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    // Key configuration: avoid SSR mismatch
    react: {
      useSuspense: false, // Disable Suspense to avoid SSR issues
    },
    interpolation: {
      escapeValue: false, // React already handles safely
    },
    detection: {
      // Prefer SSR-provided language via <html lang>, then persist
      order: ["cookie", 'localStorage', 'htmlTag', 'navigator'],
      caches: ["cookie", 'localStorage'],
      lookupCookie: 'i18nextLng',
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
