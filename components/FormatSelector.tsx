import React from 'react';
import { ImageFormat, supportedFormats } from '../types';

interface FormatSelectorProps {
  selectedFormat: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
  t: (key: string) => string;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ selectedFormat, onFormatChange, t }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{t('options_convert_to')}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {supportedFormats.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFormatChange(value)}
            className={`w-full text-center font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
              ${selectedFormat === value
                ? 'bg-indigo-600 text-white ring-indigo-500'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
