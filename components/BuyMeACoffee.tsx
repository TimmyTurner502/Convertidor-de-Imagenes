
import React from 'react';

interface BuyMeACoffeeProps {
    t: (key: string) => string;
}

const CoffeeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5h2.414a1 1 0 01.707.293l1.586 1.586A1 1 0 0116 7.586V17a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2h2zm0 0V4a1 1 0 011-1h0a1 1 0 011 1v1m-2 8h4" />
    </svg>
);


export const BuyMeACoffee: React.FC<BuyMeACoffeeProps> = ({ t }) => {
    return (
        <a
            href="https://buymeacoffee.com/giftmatch"
            target="_blank"
            rel="noopener noreferrer"
            title={t('buy_me_a_coffee')}
            className="fixed bottom-5 right-5 z-50 flex items-center justify-center p-3 h-12 bg-yellow-400 text-gray-800 font-bold rounded-full shadow-lg hover:bg-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400"
        >
            <CoffeeIcon />
            <span className="hidden md:inline ml-2 pr-1">{t('buy_me_a_coffee')}</span>
        </a>
    );
};
