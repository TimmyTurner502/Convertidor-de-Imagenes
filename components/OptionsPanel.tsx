import React from 'react';
import { FormatSelector } from './FormatSelector';
import { ImageFormat, ResizeOptions } from '../types';

interface OptionsPanelProps {
    t: (key: string) => string;
    targetFormat: ImageFormat;
    setTargetFormat: (format: ImageFormat) => void;
    preserveTransparency: boolean;
    setPreserveTransparency: (preserve: boolean) => void;
    quality: number;
    setQuality: (quality: number) => void;
    resizeOptions: ResizeOptions;
    setResizeOptions: (options: ResizeOptions) => void;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
    t,
    targetFormat,
    setTargetFormat,
    preserveTransparency,
    setPreserveTransparency,
    quality,
    setQuality,
    resizeOptions,
    setResizeOptions
}) => {
    const isAiFormat = targetFormat === 'xml';
    const canPreserveTransparency = targetFormat === 'png' || targetFormat === 'webp';
    const canSetQuality = targetFormat === 'jpeg' || targetFormat === 'webp';
    
    const handleResizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setResizeOptions({ ...resizeOptions, [name]: value === '' ? '' : Number(value) });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 pb-2">{t('options_panel_title')}</h2>
            
            <FormatSelector selectedFormat={targetFormat} onFormatChange={setTargetFormat} t={t} />

            {!isAiFormat && (
              <>
                {canPreserveTransparency && (
                    <div className="flex items-center space-x-3 pt-1">
                        <input
                            type="checkbox"
                            id="transparency-check"
                            checked={preserveTransparency}
                            onChange={(e) => setPreserveTransparency(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-400 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <label htmlFor="transparency-check" className="text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                            {t('options_preserve_transparency')}
                        </label>
                    </div>
                )}

                {canSetQuality && (
                     <div>
                        <label htmlFor="quality-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('options_quality')}: <span className="font-bold text-indigo-600 dark:text-indigo-400">{quality}%</span>
                        </label>
                        <input
                            id="quality-slider"
                            type="range"
                            min="1"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                )}
                
                <div>
                     <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{t('options_resize')}</h3>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options_width')}</label>
                            <input type="number" name="width" id="width" value={resizeOptions.width} onChange={handleResizeChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="1920" />
                         </div>
                         <div>
                            <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options_height')}</label>
                            <input type="number" name="height" id="height" value={resizeOptions.height} onChange={handleResizeChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="1080" />
                         </div>
                     </div>
                </div>
              </>
            )}

        </div>
    );
};