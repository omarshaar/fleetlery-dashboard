import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';

export function useLanguage() {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  // Keep React state in sync with i18n language so all consumers re-render instantly.
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => setLanguage(lng);
    i18n.on('languageChanged', handleLanguageChanged);

    // In case language was changed before the listener attached.
    setLanguage(i18n.language);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // Update document direction and language attributes on language change
  useEffect(() => {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    document.body.dir = direction;
  }, [language]);

  const changeLanguage = useCallback(async (lang: string) => {
    await i18n.changeLanguage(lang);
  }, [i18n]);

  const isRTL = language === 'ar';
  const isLTR = language === 'en';

  return {
    t,
    i18n,
    language,
    changeLanguage,
    isRTL,
    isLTR,
    direction: isRTL ? 'rtl' : 'ltr',
  };
}
