import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Language } from '../translations';

interface HeaderProps {
    t: (key: string) => string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    currentLanguage: Language;
    onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ t, theme, toggleTheme, currentLanguage, onLanguageChange }) => {
  return (
    <header className="p-6">
        <div className="container mx-auto flex justify-between items-center">
            <div></div>
            <div className="text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                    {t('header_title')}
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    {t('header_subtitle')}
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
                <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
            </div>
        </div>
    </header>
  );
};
