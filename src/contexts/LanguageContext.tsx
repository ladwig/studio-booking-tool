'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../translations/en';
import { de } from '../translations/de';
import { STUDIO_SETTINGS } from '../config/settings';

type Language = 'en' | 'de';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: STUDIO_SETTINGS.defaultLanguage as Language,
  translations: en,
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(STUDIO_SETTINGS.defaultLanguage as Language);
  const [translations, setTranslations] = useState<Translations>(en);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setTranslations(language === 'de' ? de : en);
  }, [language]);

  if (!isClient) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 