
import React from 'react';
import { ImageFormat } from '../types';
import { BuyMeACoffee } from './BuyMeACoffee';

interface ResultDisplayProps {
  imageUrl: string;
  fileName: string;
  t: (key: string) => string;
  isBatch: boolean;
  format: ImageFormat;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ZipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const XmlIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, fileName, t, isBatch, format }) => {
  const isImagePreviewable = !isBatch && (format === 'png' || format === 'jpeg' || format === 'webp' || format === 'svg');

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{t('result_success')}</h3>
        
        {isImagePreviewable ? (
            <img src={imageUrl} alt="Converted result" className="rounded-lg max-h-64 shadow-lg bg-white p-1" />
        ) : (
            <div className="text-center p-6">
                {isBatch ? <ZipIcon /> : <XmlIcon />}
                <p className="text-gray-700 dark:text-gray-300">
                    {isBatch ? t('result_batch_complete') : t('result_xml_complete')}
                </p>
            </div>
        )}

        <a
            href={imageUrl}
            download={fileName}
            className="w-full max-w-xs flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
            <DownloadIcon />
            {t('result_download')}
        </a>
    </div>
  );
};
