import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arCommon from './locales/ar/common.json';
import enCommon from './locales/en/common.json';
import deCommon from './locales/de/common.json';

import arComponents from './locales/ar/components.json';
import enComponents from './locales/en/components.json';
import deComponents from './locales/de/components.json';

const resources = {
  ar: {
    common: arCommon,
    components: arComponents,
  },
  en: {
    common: enCommon,
    components: enComponents,
  },
  de: {
    common: deCommon,
    components: deComponents,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
