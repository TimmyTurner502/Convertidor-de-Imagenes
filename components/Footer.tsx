import React from 'react';

interface FooterProps {
    t: (key: string) => string;
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="p-6 text-center text-gray-500 dark:text-gray-500 text-sm">
      <p>&copy; {new Date().getFullYear()} {t('footer_copyright')}</p>
      <p className="mt-1">{t('footer_privacy')}</p>
    </footer>
  );
};
