'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../translations/en';
import { de } from '../translations/de';

type Translations = typeof en;

interface LanguageContextType {
  language: string;
  translations: Translations;
  setLanguage: (lang: string) => void;
}

const translations = {
  en,
  de,
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  translations: en,
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState('en');

  const setLanguage = (newLang: string) => {
    console.log('Setting language to:', newLang);
    setLanguageState(newLang);
  };

  useEffect(() => {
    // Get browser language
    const browserLang = navigator.language.split('-')[0];
    console.log('Browser language detected:', browserLang);
    // Set language if we support it
    if (browserLang in translations) {
      console.log('Setting initial language to:', browserLang);
      setLanguage(browserLang);
    }
  }, []);

  const value = {
    language,
    translations: translations[language as keyof typeof translations],
    setLanguage,
  };

  console.log('Current language context:', value);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 