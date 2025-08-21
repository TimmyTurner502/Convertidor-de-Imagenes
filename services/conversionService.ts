import { ConversionOptions } from '../types';
import { GoogleGenAI } from '@google/genai';

// Helper to create an SVG data URL by embedding the original raster image.
const createSvgDataUrl = (sourceDataUrl: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve) => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <image href="${sourceDataUrl}" width="${width}" height="${height}" />
      </svg>`;
    const svgBase64 = btoa(svgString);
    resolve(`data:image/svg+xml;base64,${svgBase64}`);
  });
};

const convertImageToAiXml = async (sourceDataUrl: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey });

  const base64Data = sourceDataUrl.split(',')[1];
  const mimeType = sourceDataUrl.match(/data:(.*);base64,/)?.[1] ?? 'image/png';

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  const textPart = {
    text: `You are an expert in Android development and vector graphics. Convert the following raster image data into a concise Android Vector Drawable XML format.
    The image is an icon. The resulting XML should use a single <path> element with 'pathData' if possible.
    The vector drawable should have a viewport width and height that make sense for the icon's aspect ratio, and the dimensions should be simple integers (e.g., 24x24).
    Do not include any explanation, surrounding text, or markdown code fences. Output only the raw XML code starting with "<vector...>" and ending with "</vector>".`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });

  const xmlContent = response.text.trim();

  // Basic validation to ensure we got something that looks like XML
  if (!xmlContent.startsWith('<vector') || !xmlContent.endsWith('</vector>')) {
    throw new Error('AI did not return a valid Vector Drawable XML.');
  }

  return 'data:application/xml;charset=utf-8,' + encodeURIComponent(xmlContent);
};


export const convertImage = (
  file: File,
  options: ConversionOptions
): Promise<{name: string, dataUrl: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      const sourceDataUrl = event.target?.result as string;
      img.src = sourceDataUrl;

      img.onload = async () => {
        const originalName = file.name.split('.').slice(0, -1).join('.');
        const newName = `${originalName}.${options.targetFormat}`;

        // AI XML conversion path
        if (options.targetFormat === 'xml') {
            try {
                const xmlDataUrl = await convertImageToAiXml(sourceDataUrl);
                resolve({ name: newName, dataUrl: xmlDataUrl });
            } catch(err) {
                reject(err);
            }
            return;
        }


        // SVG conversion path
        if (options.targetFormat === 'svg') {
          const svgDataUrl = await createSvgDataUrl(sourceDataUrl, img.width, img.height);
          resolve({ name: newName, dataUrl: svgDataUrl });
          return;
        }

        // Raster conversion path (PNG, JPEG, WEBP)
        const canvas = document.createElement('canvas');
        
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (options.width || options.height) {
            const aspectRatio = img.width / img.height;
            if (options.width && !options.height) {
                targetWidth = options.width;
                targetHeight = options.width / aspectRatio;
            } else if (!options.width && options.height) {
                targetHeight = options.height;
                targetWidth = options.height * aspectRatio;
            } else {
                targetWidth = options.width!;
                targetHeight = options.height!;
            }
        }
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context.'));
        }

        // Add a white background if needed
        const addBackground = options.targetFormat === 'jpeg' || !options.preserveTransparency;
        if (addBackground) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const mimeType = `image/${options.targetFormat}`;
        const dataUrl = canvas.toDataURL(mimeType, options.quality);

        resolve({ name: newName, dataUrl });
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
};