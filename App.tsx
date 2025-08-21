
import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FilePreview } from './components/FilePreview';
import { OptionsPanel } from './components/OptionsPanel';
import { ConvertButton } from './components/ConvertButton';
import { BuyMeACoffee } from './components/BuyMeACoffee';
import { convertImage } from './services/conversionService';
import { ImageFormat, ResizeOptions, ConversionOptions } from './types';
import { useTranslations, Language } from './translations';

// This function ensures React's initial state matches what the blocking script set.
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as 'light' | 'dark';
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light'; // Default to light
};

const App: React.FC = () => {
  const { t, language, setLanguage, getInitialLanguage } = useTranslations();

  // Component state
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Options state
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png');
  const [preserveTransparency, setPreserveTransparency] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(90);
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    width: '',
    height: '',
    maintainAspectRatio: true,
  });
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  // Initialize language only on mount
  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguage(initialLang);
  }, []);
  
  // This useEffect handles theme changes AFTER initial load (i.e., when user clicks the button)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleFileSelect = (files: File[]) => {
    setSourceFiles(files);
    setConvertedFileUrl(null);
    setError(null);
  };

  const handleConversion = useCallback(async () => {
    if (sourceFiles.length === 0) {
      setError(t('error_select_files'));
      return;
    }

    setIsConverting(true);
    setError(null);
    setConvertedFileUrl(null);

    try {
      const options: ConversionOptions = {
        targetFormat,
        quality: quality / 100,
        preserveTransparency,
        width: resizeOptions.width ? Number(resizeOptions.width) : undefined,
        height: resizeOptions.height ? Number(resizeOptions.height) : undefined,
      };

      const conversionPromises = sourceFiles.map(file => convertImage(file, options));
      const convertedImages = await Promise.all(conversionPromises);

      if (convertedImages.length === 1) {
         setConvertedFileUrl(convertedImages[0].dataUrl);
      } else {
        const zip = new JSZip();
        convertedImages.forEach(({ name, dataUrl }) => {
          const base64Data = dataUrl.split(',')[1];
          zip.file(name, base64Data, { base64: true });
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipUrl = URL.createObjectURL(zipBlob);
        setConvertedFileUrl(zipUrl);
      }

    } catch (err) {
      setError(t('error_conversion_generic'));
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  }, [sourceFiles, targetFormat, quality, preserveTransparency, resizeOptions, t]);
  
  const handleReset = () => {
    setSourceFiles([]);
    setConvertedFileUrl(null);
    setError(null);
    setIsConverting(false);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSourceFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const getResultFileName = () => {
    if (sourceFiles.length > 1) {
      return 'converted-images.zip';
    }
    if (sourceFiles.length === 1) {
      const originalName = sourceFiles[0].name.split('.').slice(0, -1).join('.');
      return `${originalName}.${targetFormat}`;
    }
    return `image.${targetFormat}`;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header 
        t={t} 
        theme={theme} 
        toggleTheme={toggleTheme}
        currentLanguage={language}
        onLanguageChange={setLanguage} 
      />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 transition-colors duration-300">
          {sourceFiles.length === 0 ? (
            <ImageUploader onFileSelect={handleFileSelect} t={t} setError={setError} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <FilePreview 
                    files={sourceFiles} 
                    t={t}
                    onRemoveFile={handleRemoveFile}
                    onClearAll={handleReset}
                 />
                 <OptionsPanel 
                    t={t}
                    targetFormat={targetFormat}
                    setTargetFormat={setTargetFormat}
                    preserveTransparency={preserveTransparency}
                    setPreserveTransparency={setPreserveTransparency}
                    quality={quality}
                    setQuality={setQuality}
                    resizeOptions={resizeOptions}
                    setResizeOptions={setResizeOptions}
                 />
              </div>
              <div className="lg:col-span-3 flex flex-col">
                <div className="flex-grow flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                    {isConverting && <Loader t={t} isAi={targetFormat === 'xml'} />}
                    {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
                    {convertedFileUrl && (
                    <ResultDisplay 
                        imageUrl={convertedFileUrl} 
                        fileName={getResultFileName()}
                        t={t}
                        isBatch={sourceFiles.length > 1}
                        format={targetFormat}
                    />
                    )}
                    {!isConverting && !convertedFileUrl && !error && (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <p>{t('result_placeholder')}</p>
                        </div>
                    )}
                </div>
                <div className="flex space-x-4 pt-6">
                    <ConvertButton onClick={handleConversion} disabled={isConverting} t={t} />
                    <button
                      onClick={handleReset}
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400"
                    >
                      {t('button_convert_another')}
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer t={t} />
      <BuyMeACoffee t={t} />
    </div>
  );
};

export default App;