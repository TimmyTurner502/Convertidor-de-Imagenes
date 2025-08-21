
import React from 'react';

interface FilePreviewProps {
    files: File[];
    t: (key: string) => string;
    onRemoveFile: (index: number) => void;
    onClearAll: () => void;
}

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0011.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const FilePreview: React.FC<FilePreviewProps> = ({ files, t, onRemoveFile, onClearAll }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{t('file_preview_title')}</h3>
                {files.length > 0 && (
                    <button 
                        onClick={onClearAll}
                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                        {t('file_preview_clear_all')}
                    </button>
                )}
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 bg-gray-100 dark:bg-gray-900/50 p-3 rounded-lg">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                        <FileIcon />
                        <div className="flex-grow truncate">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={file.name}>{file.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
                        </div>
                        <button
                            onClick={() => onRemoveFile(index)}
                            className="ml-2 p-1.5 rounded-full text-gray-400 hover:bg-red-100 dark:hover:bg-red-800/50 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            aria-label={t('file_preview_remove_file')}
                        >
                            <TrashIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
