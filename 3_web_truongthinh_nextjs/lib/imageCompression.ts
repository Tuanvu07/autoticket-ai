// ═══════════════════════════════════════════════════════════════
//  IMAGE COMPRESSION UTILITY
//  ───────────────────────────────────────────────────────────────
//  Resize image canvas to reduce file size before uploading to OCR API.
//  Target: < 1MB for optimal bandwidth usage.
// ═══════════════════════════════════════════════════════════════

/**
 * Compress image by resizing canvas.
 * Reduces 10MB+ photos to < 1MB while maintaining OCR-readable quality.
 *
 * @param base64Image - Image in data:image/jpeg;base64,... format
 * @param maxWidth - Target width (default 1024px)
 * @param maxHeight - Target height (default 768px)
 * @param quality - JPEG quality 0-1 (default 0.8)
 * @returns Promise<string> - Compressed Base64 image
 */
export async function compressImage(
  base64Image: string,
  maxWidth: number = 1024,
  maxHeight: number = 768,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Create canvas and draw resized image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with quality compression
      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Set crossOrigin to avoid taint issues (though shouldn't happen with data URLs)
    img.crossOrigin = "anonymous";
    img.src = base64Image;
  });
}

/**
 * Get image file size in MB
 */
export function getImageSizeMB(base64Image: string): number {
  return Buffer.byteLength(base64Image, "utf8") / (1024 * 1024);
}

/**
 * Estimate compression ratio (useful for UI feedback)
 */
export function estimateCompressionRatio(
  original: string,
  compressed: string
): number {
  const origSize = Buffer.byteLength(original, "utf8");
  const compSize = Buffer.byteLength(compressed, "utf8");
  return (100 - (compSize / origSize) * 100).toFixed(1);
}
