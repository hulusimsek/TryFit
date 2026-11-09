/**
 * Client-side smart background removal & color extractor for e-commerce garment photos.
 * Detects white/light studio background and turns it transparent with soft feathered edges.
 */

export interface ProcessedGarmentImage {
  transparentDataUrl: string;
  dominantColor: string;
}

export async function removeImageBackground(
  imageUrl: string,
  tolerance: number = 38
): Promise<ProcessedGarmentImage> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ transparentDataUrl: imageUrl, dominantColor: '#334155' });
        return;
      }

      const w = img.naturalWidth || img.width || 400;
      const h = img.naturalHeight || img.height || 600;
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Sample 4 corners to detect the studio backdrop color
      const samplePoints = [
        0,                                   // Top-left
        (w - 1) * 4,                         // Top-right
        ((h - 1) * w) * 4,                   // Bottom-left
        ((h - 1) * w + (w - 1)) * 4          // Bottom-right
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      samplePoints.forEach(idx => {
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR = Math.round(bgR / 4);
      bgG = Math.round(bgG / 4);
      bgB = Math.round(bgB / 4);

      // Color bucket accumulator for dominant garment color
      let colorR = 0, colorG = 0, colorB = 0, garmentPixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from backdrop color
        const dist = Math.sqrt(
          (r - bgR) * (r - bgR) +
          (g - bgG) * (g - bgG) +
          (b - bgB) * (b - bgB)
        );

        if (dist < tolerance) {
          // Pixel matches background: make transparent
          data[i + 3] = 0;
        } else if (dist < tolerance + 15) {
          // Smooth edge feathering
          const alphaFactor = (dist - tolerance) / 15;
          data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        } else {
          // Garment pixel
          if (garmentPixelCount < 10000) {
            colorR += r;
            colorG += g;
            colorB += b;
            garmentPixelCount++;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentDataUrl = canvas.toDataURL('image/png');

      const dominantColor = garmentPixelCount > 0
        ? `rgb(${Math.round(colorR / garmentPixelCount)}, ${Math.round(colorG / garmentPixelCount)}, ${Math.round(colorB / garmentPixelCount)})`
        : '#e2e8f0';

      resolve({ transparentDataUrl, dominantColor });
    };

    img.onerror = () => {
      // Fallback
      resolve({ transparentDataUrl: imageUrl, dominantColor: '#334155' });
    };

    img.src = imageUrl;
  });
}
