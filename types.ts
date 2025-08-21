export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'svg' | 'xml';

export const supportedFormats: { value: ImageFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'svg', label: 'SVG' },
  { value: 'xml', label: 'XML (AI)'},
];

export interface ResizeOptions {
    width: number | '';
    height: number | '';
    maintainAspectRatio: boolean;
}

export interface ConversionOptions {
    targetFormat: ImageFormat;
    quality: number;
    preserveTransparency: boolean;
    width?: number;
    height?: number;
}