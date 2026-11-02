// Universal SVG fallback avatar - Zero external network calls, 100% offline-proof
export const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='24' fill='%231e293b'/%3E%3Ccircle cx='60' cy='46' r='24' fill='%23f59e0b' opacity='0.9'/%3E%3Cpath d='M24 104 C24 82 40 76 60 76 C80 76 96 82 96 104' fill='%23f59e0b' opacity='0.9'/%3E%3C/svg%3E";

/**
 * Safe image error handler that prevents infinite error loops in React.
 * Setting `e.target.onerror = null` stops Chrome from endlessly re-triggering onError.
 */
export const handleImageError = (e) => {
  if (e && e.target) {
    e.target.onerror = null;
    e.target.src = DEFAULT_AVATAR;
  }
};

/**
 * ImageKit & Cloud Responsive Transformation
 * Automatically serves lightweight WebP/AVIF images with face-centering
 */
export const getOptimizedAvatar = (url, size = 300) => {
  if (!url || typeof url !== 'string') return DEFAULT_AVATAR;
  
  // ImageKit on-the-fly transformation
  if (url.includes('ik.imagekit.io')) {
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?tr=w-${size},h-${size},fo-face,q-80,f-auto`;
  }
  
  // Unsplash responsive transformation
  if (url.includes('images.unsplash.com')) {
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?w=${size}&h=${size}&auto=format&fit=crop&crop=faces&q=80`;
  }
  
  return url;
};

/**
 * Portfolio image optimizer
 */
export const getOptimizedPortfolioImage = (url, width = 800) => {
  if (!url || typeof url !== 'string') return DEFAULT_AVATAR;
  
  if (url.includes('ik.imagekit.io')) {
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?tr=w-${width},q-80,f-auto`;
  }
  
  return url;
};
