import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

interface ImageUploaderProps {
  onFileSelect: (files: File[]) => void;
  t: (key: string) => string;
  setError: (error: string | null) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, t, setError }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setError(null);
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect, setError]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
     if (fileRejections.some(rejection => rejection.errors.some(error => error.code === 'too-many-files'))) {
         setError(t('error_too_many_files'));
     }
  }, [setError, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
    multiple: true,
    maxFiles: 10,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-4 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out text-center
        ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-gray-500/10'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <UploadIcon />
        {isDragActive ? (
          <p className="text-lg font-semibold text-indigo-500 dark:text-indigo-400">{t('uploader_drop_files')}</p>
        ) : (
          <>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('uploader_drag_drop')}</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">{t('uploader_or')}</p>
            <button
                type="button"
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
            >
                {t('uploader_browse')}
            </button>
          </>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">{t('uploader_supports')}</p>
      </div>
    </div>
  );
};