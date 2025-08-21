import React from 'react';

interface ConvertButtonProps {
  onClick: () => void;
  disabled: boolean;
  t: (key: string) => string;
}

const ConvertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5m-5 5h5v-5M4 9V4h5m11 11v5h-5m5-16h-5v5" />
    </svg>
);


export const ConvertButton: React.FC<ConvertButtonProps> = ({ onClick, disabled, t }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
    >
      <ConvertIcon />
      {disabled ? t('button_converting') : t('button_convert')}
    </button>
  );
};
