import imageCompression from 'browser-image-compression';

// Cloudflare R2 Upload Configuration
const R2_CONFIG = {
  accountId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID,
  bucketName: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
  publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL, // Your custom domain or R2.dev URL
};

/**
 * Image optimization settings for different use cases
 */
const OPTIMIZATION_PRESETS = {
  logo: {
    maxWidthOrHeight: 400,
    maxSizeMB: 0.3,
    quality: 0.9,
    fileType: 'image/jpeg',
  },
  deal: {
    maxWidthOrHeight: 1200,
    maxSizeMB: 1,
    quality: 0.85,
    fileType: 'image/jpeg',
  },
  banner: {
    maxWidthOrHeight: 1920,
    maxSizeMB: 1.5,
    quality: 0.8,
    fileType: 'image/jpeg',
  },
  company: {
    maxWidthOrHeight: 800,
    maxSizeMB: 0.8,
    quality: 0.85,
    fileType: 'image/jpeg',
  },
};

/**
 * Optimize an image based on type
 * @param {File} file - The image file to optimize
 * @param {string} type - Image type: 'logo', 'deal', 'banner', 'company'
 * @returns {Promise<File>} - Optimized image file
 */
export async function optimizeImage(file, type = 'deal') {
  if (!file) throw new Error('No file provided');

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Please upload a JPG, PNG, or WebP image');
  }

  // Get optimization preset
  const preset = OPTIMIZATION_PRESETS[type] || OPTIMIZATION_PRESETS.deal;

  try {
    const options = {
      maxSizeMB: preset.maxSizeMB,
      maxWidthOrHeight: preset.maxWidthOrHeight,
      useWebWorker: true,
      initialQuality: preset.quality,
      fileType: preset.fileType,
    };

    const compressedFile = await imageCompression(file, options);
    
    // Create a new File object with proper name
    const fileExt = 'jpg';
    const fileName = file.name.replace(/\.[^/.]+$/, `.${fileExt}`);
    
    return new File([compressedFile], fileName, {
      type: preset.fileType,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Image optimization failed:', error);
    throw new Error('Failed to optimize image. Please try another file.');
  }
}

/**
 * Upload optimized image to Cloudflare R2 via API route
 * @param {File} file - Optimized image file
 * @param {string} folder - Folder path in R2 bucket (e.g., 'company-logos', 'deal-images')
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export async function uploadToR2(file, folder = 'images') {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('R2 upload failed:', error);
    throw error;
  }
}

/**
 * Complete workflow: Optimize and upload image
 * @param {File} file - Original image file
 * @param {string} type - Image type for optimization
 * @param {string} folder - R2 folder path
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export async function optimizeAndUpload(file, type = 'deal', folder = 'images') {
  const optimizedFile = await optimizeImage(file, type);
  const url = await uploadToR2(optimizedFile, folder);
  return url;
}

/**
 * Generate a unique filename
 * @param {string} originalName - Original filename
 * @param {string} prefix - Optional prefix (e.g., company ID)
 * @returns {string} - Unique filename
 */
export function generateUniqueFilename(originalName, prefix = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = 'jpg'; // We always convert to JPG
  const cleanPrefix = prefix ? `${prefix}-` : '';
  return `${cleanPrefix}${timestamp}-${random}.${ext}`;
}

/**
 * Validate image file before processing
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 10)
 * @returns {Object} - { valid: boolean, error?: string }
 */
export function validateImageFile(file, maxSizeMB = 10) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPG, PNG, or WebP image' };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  return { valid: true };
}

/**
 * Create image preview URL (for showing preview before upload)
 * @param {File} file - Image file
 * @returns {string} - Object URL for preview
 */
export function getImagePreviewUrl(file) {
  return URL.createObjectURL(file);
}

/**
 * Cleanup preview URL to prevent memory leaks
 * @param {string} url - Object URL to revoke
 */
export function revokeImagePreviewUrl(url) {
  URL.revokeObjectURL(url);
}

// Specific helper functions for each image type
export const optimizeLogo = (file) => optimizeImage(file, 'logo');
export const optimizeDealImage = (file) => optimizeImage(file, 'deal');
export const optimizeBanner = (file) => optimizeImage(file, 'banner');
export const optimizeCompanyImage = (file) => optimizeImage(file, 'company');