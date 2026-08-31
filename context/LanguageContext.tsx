import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLanguage, Translations } from '../constants/Translations';
import * as Haptics from 'expo-haptics';

const LANGUAGE_STORAGE_KEY = '@fridge_chef_language';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  toggleLanguage: () => Promise<void>;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  toggleLanguage: async () => {},
  t: (keyPath: string) => keyPath,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'tr' || saved === 'en') {
        setLanguageState(saved);
      } else {
        setLanguageState('en'); // Default to English primary
      }
    } catch {
      setLanguageState('en');
    }
  };

  const setLanguage = async (lang: SupportedLanguage) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setLanguageState(lang);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const toggleLanguage = async () => {
    const nextLang: SupportedLanguage = language === 'en' ? 'tr' : 'en';
    await setLanguage(nextLang);
  };

  /**
   * Safe nested key getter: t('home.scanChamberTitle')
   */
  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = Translations[language] || Translations['en'];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback: any = Translations['en'];
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return keyPath;
          }
        }
        return typeof fallback === 'string' ? fallback : keyPath;
      }
    }

    return typeof current === 'string' ? current : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
