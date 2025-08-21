import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../translations';

interface LanguageSwitcherProps {
    currentLanguage: Language;
    onLanguageChange: (lang: Language) => void;
}

const languages: { code: Language, name: string }[] = [
    { code: 'es', name: 'ES' },
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
    { code: 'pt', name: 'PT' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onLanguageChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);


    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 w-12 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-300"
            >
                {currentLanguage.toUpperCase()}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                    {languages.map(lang => (
                        <a
                            key={lang.code}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onLanguageChange(lang.code);
                                setIsOpen(false);
                            }}
                            className={`block px-4 py-2 text-sm ${currentLanguage === lang.code ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-600`}
                        >
                            {lang.name}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};
