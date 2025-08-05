"use client";

import { createContext, useContext, useEffect } from "react";
import { useLanguageStore } from "@/stores/languageStore";
import { translations, type Language } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguageStore();

  // 获取当前语言的翻译
  const t = translations[language];

  // 在语言改变时更新 HTML lang 属性
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}